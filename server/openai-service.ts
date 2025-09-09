import OpenAI from 'openai';
import type { Job, Backend } from '@shared/schema';

class OpenAIQuantumService {
  private client: OpenAI;
  private isConfigured: boolean = false;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
      this.isConfigured = true;
      console.log('✅ OpenAI service configured for quantum analysis');
    } else {
      console.log('⚠️  OpenAI API key not found - AI features will be disabled');
    }
  }

  async generateJobSuggestions(jobData: {
    qubits: number;
    shots: number;
    backend: string;
    program?: string;
  }): Promise<{
    circuitSuggestions: string[];
    optimizationTips: string[];
    backendRecommendations: string[];
    estimatedRuntime: string;
  }> {
    if (!this.isConfigured) {
      return this.getFallbackSuggestions();
    }

    try {
      const prompt = `As a quantum computing expert, analyze this quantum job configuration and provide suggestions:

Qubits: ${jobData.qubits}
Shots: ${jobData.shots}
Backend: ${jobData.backend}
Circuit: ${jobData.program || 'Not provided'}

Please provide:
1. Circuit improvement suggestions (max 3)
2. Optimization tips for better performance (max 3)
3. Backend recommendations if current choice isn't optimal (max 2)
4. Estimated runtime category (Very Fast/Fast/Medium/Slow/Very Slow)

Format your response as JSON with keys: circuitSuggestions, optimizationTips, backendRecommendations, estimatedRuntime`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content);
        } catch (parseError) {
          console.warn('Failed to parse AI response, using fallback');
          return this.getFallbackSuggestions();
        }
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
    }

    return this.getFallbackSuggestions();
  }

  async analyzeFailedJob(job: Job): Promise<{
    possibleCauses: string[];
    suggestions: string[];
    circuitImprovements: string[];
    preventionTips: string[];
  }> {
    if (!this.isConfigured) {
      return this.getFallbackFailureAnalysis();
    }

    try {
      const prompt = `Analyze this failed quantum job and provide insights:

Job ID: ${job.id}
Name: ${job.name}
Backend: ${job.backend}
Qubits: ${job.qubits}
Shots: ${job.shots}
Error: ${job.error || 'No specific error message'}
Circuit: ${job.program || 'Circuit not available'}
Duration: ${job.duration || 0} seconds

As a quantum computing expert, provide:
1. Most likely causes for the failure (max 3)
2. Specific suggestions to fix the issue (max 3)
3. Circuit improvements to prevent similar failures (max 3)
4. General prevention tips (max 2)

Format as JSON with keys: possibleCauses, suggestions, circuitImprovements, preventionTips`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content);
        } catch (parseError) {
          console.warn('Failed to parse AI failure analysis, using fallback');
          return this.getFallbackFailureAnalysis();
        }
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
    }

    return this.getFallbackFailureAnalysis();
  }

  async generateCircuitCode(description: string, qubits: number): Promise<string> {
    if (!this.isConfigured) {
      return this.getFallbackCircuitCode(qubits);
    }

    try {
      const prompt = `Generate Qiskit quantum circuit code for: "${description}"
      
Requirements:
- Use exactly ${qubits} qubits
- Include necessary imports
- Create a complete, runnable circuit
- Add measurement instructions
- Include helpful comments

Return only the Python/Qiskit code:`;

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.8,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        // Extract code from response (remove markdown formatting if present)
        return content.replace(/```python\n?|```\n?/g, '').trim();
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
    }

    return this.getFallbackCircuitCode(qubits);
  }

  private getFallbackSuggestions() {
    return {
      circuitSuggestions: [
        "Consider reducing circuit depth for better fidelity",
        "Add error mitigation techniques like ZNE",
        "Optimize gate placement to minimize crosstalk"
      ],
      optimizationTips: [
        "Use fewer shots for faster execution in testing",
        "Choose backends with better coherence times",
        "Consider variational algorithms for complex problems"
      ],
      backendRecommendations: [
        "ibm_brisbane for high-fidelity operations",
        "ibm_kyoto for larger qubit counts"
      ],
      estimatedRuntime: "Medium"
    };
  }

  private getFallbackFailureAnalysis() {
    return {
      possibleCauses: [
        "Circuit depth exceeded decoherence time",
        "Backend calibration issues during execution",
        "Queue timeout or system maintenance"
      ],
      suggestions: [
        "Reduce circuit complexity and depth",
        "Try a different backend with better uptime",
        "Implement error mitigation strategies"
      ],
      circuitImprovements: [
        "Use native gate sets for the target backend",
        "Minimize two-qubit gate operations",
        "Add error correction codes where possible"
      ],
      preventionTips: [
        "Monitor backend status before job submission",
        "Test with fewer shots initially"
      ]
    };
  }

  private getFallbackCircuitCode(qubits: number): string {
    return `from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister

# Create quantum and classical registers
qreg = QuantumRegister(${qubits}, 'q')
creg = ClassicalRegister(${qubits}, 'c')

# Create the quantum circuit
circuit = QuantumCircuit(qreg, creg)

# Example: Create superposition state
for i in range(${qubits}):
    circuit.h(qreg[i])

# Add measurements
circuit.measure(qreg, creg)

print(circuit)`;
  }

  isServiceConfigured(): boolean {
    return this.isConfigured;
  }
}

export const openaiService = new OpenAIQuantumService();