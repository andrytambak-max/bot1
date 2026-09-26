/**
 * Provider Client - Abstraction for different AI provider APIs
 */

import { AIProviderConfig } from './config';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}

export class ProviderClient {
  private provider: AIProviderConfig;

  constructor(provider: AIProviderConfig) {
    this.provider = provider;
  }

  /**
   * Send message to AI provider
   */
  async generate(
    messages: Message[],
    options?: GenerateOptions
  ): Promise<string> {
    const providerId = this.provider.id;

    switch (providerId) {
      case 'gemini':
        return this.generateGemini(messages, options);
      case 'claude':
        return this.generateClaude(messages, options);
      case 'gpt':
        return this.generateOpenAI(messages, options);
      case 'deepseek':
        return this.generateDeepseek(messages, options);
      case 'grok':
        return this.generateGrok(messages, options);
      case 'local':
        return this.generateLocal(messages, options);
      default:
        throw new Error(`Unknown provider: ${providerId}`);
    }
  }

  /**
   * Generate with Google Gemini
   */
  private async generateGemini(
    messages: Message[],
    options?: GenerateOptions
  ): Promise<string> {
    const response = await fetch(
      `${this.provider.apiUrl}/${this.provider.model}:generateContent?key=${this.provider.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.provider.headers,
        },
        body: JSON.stringify({
          contents: messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          })),
          generationConfig: {
            temperature: options?.temperature || 0.7,
            maxOutputTokens: options?.maxTokens || 2000,
            topP: options?.topP,
            topK: options?.topK,
          },
        }),
        timeout: this.provider.timeout,
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  /**
   * Generate with Anthropic Claude
   */
  private async generateClaude(
    messages: Message[],
    options?: GenerateOptions
  ): Promise<string> {
    const response = await fetch(`${this.provider.apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.provider.apiKey,
        'anthropic-version': '2023-06-01',
        ...this.provider.headers,
      },
      body: JSON.stringify({
        model: this.provider.model,
        max_tokens: options?.maxTokens || 2000,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options?.temperature || 0.7,
      }),
      timeout: this.provider.timeout,
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
  }

  /**
   * Generate with OpenAI GPT
   */
  private async generateOpenAI(
    messages: Message[],
    options?: GenerateOptions
  ): Promise<string> {
    const response = await fetch(`${this.provider.apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.provider.apiKey}`,
        ...this.provider.headers,
      },
      body: JSON.stringify({
        model: this.provider.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2000,
        top_p: options?.topP,
      }),
      timeout: this.provider.timeout,
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Generate with Deepseek
   */
  private async generateDeepseek(
    messages: Message[],
    options?: GenerateOptions
  ): Promise<string> {
    const response = await fetch(`${this.provider.apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.provider.apiKey}`,
        ...this.provider.headers,
      },
      body: JSON.stringify({
        model: this.provider.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2000,
      }),
      timeout: this.provider.timeout,
    });

    if (!response.ok) {
      throw new Error(`Deepseek API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Generate with xAI Grok
   */
  private async generateGrok(
    messages: Message[],
    options?: GenerateOptions
  ): Promise<string> {
    const response = await fetch(`${this.provider.apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.provider.apiKey}`,
        ...this.provider.headers,
      },
      body: JSON.stringify({
        model: this.provider.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2000,
      }),
      timeout: this.provider.timeout,
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Generate with Local Ollama
   */
  private async generateLocal(
    messages: Message[],
    options?: GenerateOptions
  ): Promise<string> {
    const response = await fetch(`${this.provider.apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.provider.headers,
      },
      body: JSON.stringify({
        model: this.provider.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: options?.temperature || 0.7,
      }),
      timeout: this.provider.timeout,
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
}

export default ProviderClient;
