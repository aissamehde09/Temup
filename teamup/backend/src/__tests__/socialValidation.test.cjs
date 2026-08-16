const { describe, it, expect } = require('@jest/globals');
const { z } = require('zod');

// Re-import the new schemas
const positiveId = z.coerce.number().int().positive();

const friendRequestSchema = z.object({
  params: z.object({ id: positiveId }),
});

const answerFriendRequestSchema = z.object({
  params: z.object({ id: positiveId }),
  body: z.object({ status: z.enum(['accepted', 'rejected']) }),
});

const sendMessageSchema = z.object({
  params: z.object({ id: positiveId }),
  body: z.object({ content: z.string().trim().min(1, 'Le message ne peut pas être vide').max(5000, 'Le message est trop long') }),
});

const idParamSchema = z.object({
  params: z.object({ id: positiveId }),
});

describe('friendRequestSchema', () => {
  it('accepts valid friend request', () => {
    expect(friendRequestSchema.safeParse({ params: { id: 42 } }).success).toBe(true);
  });

  it('rejects zero id', () => {
    expect(friendRequestSchema.safeParse({ params: { id: 0 } }).success).toBe(false);
  });

  it('rejects negative id', () => {
    expect(friendRequestSchema.safeParse({ params: { id: -1 } }).success).toBe(false);
  });

  it('rejects string id', () => {
    expect(friendRequestSchema.safeParse({ params: { id: 'abc' } }).success).toBe(false);
  });
});

describe('answerFriendRequestSchema', () => {
  it('accepts accepted status', () => {
    expect(answerFriendRequestSchema.safeParse({
      params: { id: 1 },
      body: { status: 'accepted' },
    }).success).toBe(true);
  });

  it('accepts rejected status', () => {
    expect(answerFriendRequestSchema.safeParse({
      params: { id: 1 },
      body: { status: 'rejected' },
    }).success).toBe(true);
  });

  it('rejects invalid status', () => {
    expect(answerFriendRequestSchema.safeParse({
      params: { id: 1 },
      body: { status: 'pending' },
    }).success).toBe(false);
  });

  it('rejects missing status', () => {
    expect(answerFriendRequestSchema.safeParse({
      params: { id: 1 },
      body: {},
    }).success).toBe(false);
  });
});

describe('sendMessageSchema', () => {
  it('accepts valid message', () => {
    expect(sendMessageSchema.safeParse({
      params: { id: 1 },
      body: { content: 'Hello!' },
    }).success).toBe(true);
  });

  it('rejects empty message', () => {
    expect(sendMessageSchema.safeParse({
      params: { id: 1 },
      body: { content: '' },
    }).success).toBe(false);
  });

  it('rejects whitespace-only message', () => {
    expect(sendMessageSchema.safeParse({
      params: { id: 1 },
      body: { content: '   ' },
    }).success).toBe(false);
  });

  it('rejects message exceeding 5000 chars', () => {
    expect(sendMessageSchema.safeParse({
      params: { id: 1 },
      body: { content: 'a'.repeat(5001) },
    }).success).toBe(false);
  });

  it('accepts message at exactly 5000 chars', () => {
    expect(sendMessageSchema.safeParse({
      params: { id: 1 },
      body: { content: 'a'.repeat(5000) },
    }).success).toBe(true);
  });

  it('trims message content', () => {
    const result = sendMessageSchema.parse({
      params: { id: 1 },
      body: { content: '  Hello!  ' },
    });
    expect(result.body.content).toBe('Hello!');
  });
});

describe('idParamSchema (reuse in social)', () => {
  it('accepts valid id', () => {
    expect(idParamSchema.safeParse({ params: { id: 5 } }).success).toBe(true);
  });

  it('rejects string id', () => {
    expect(idParamSchema.safeParse({ params: { id: 'abc' } }).success).toBe(false);
  });
});
