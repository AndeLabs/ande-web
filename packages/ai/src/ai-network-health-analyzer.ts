'use server';

/**
 * @fileOverview An AI-powered network health analyzer for the ANDE Network.
 *
 * - analyzeNetworkHealth - A function that analyzes the network health and provides insights and recommendations.
 * - NetworkHealthInput - The input type for the analyzeNetworkHealth function.
 * - NetworkHealthOutput - The return type for the analyzeNetworkHealth function.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

const ai = genkit({
  plugins: [googleAI()],
  model: 'gemini-1.5-flash',
});


const NetworkHealthInputSchema = z.object({
  networkMetrics: z
    .string()
    .describe(
      'A JSON string containing network metrics, including transaction volume, block time, network utilization, and number of active nodes.'
    ),
});
export type NetworkHealthInput = z.infer<typeof NetworkHealthInputSchema>;

const NetworkHealthOutputSchema = z.object({
  overallHealth: z
    .string()
    .describe('An overall assessment of the network health (e.g., "Healthy", "Degraded", "Critical").'),
  potentialIssues: z
    .array(z.string())
    .describe('A list of potential issues identified in the network.'),
  recommendations: z
    .array(z.string())
    .describe('A list of recommendations for optimizing the network.'),
});
export type NetworkHealthOutput = z.infer<typeof NetworkHealthOutputSchema>;

export async function analyzeNetworkHealth(
  input: NetworkHealthInput
): Promise<NetworkHealthOutput> {
  return analyzeNetworkHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'networkHealthPrompt',
  input: {schema: NetworkHealthInputSchema},
  output: {schema: NetworkHealthOutputSchema},
  prompt: `You are an AI-powered network health analyzer for the ANDE Network.

You will receive network metrics and provide insights into potential issues and recommendations for optimization.

Analyze the following network metrics:

{{{networkMetrics}}}

Provide the output in JSON format:
{
  "overallHealth": "An overall assessment of the network health (e.g., \"Healthy\", \"Degraded\", \"Critical\")",
  "potentialIssues": ["A list of potential issues identified in the network"],
  "recommendations": ["A list of recommendations for optimizing the network"]
}
`,
});

const analyzeNetworkHealthFlow = ai.defineFlow(
  {
    name: 'analyzeNetworkHealthFlow',
    inputSchema: NetworkHealthInputSchema,
    outputSchema: NetworkHealthOutputSchema,
  },
  async (input: any) => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error: any) {
      console.error('Error analyzing network health:', error);
      throw new Error(
        `Failed to analyze network health: ${error.message || error}`
      );
    }
  }
);
