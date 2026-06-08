import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../src/server.js';

describe('API integration', () => {
  it('creates a list, adds item, marks purchased and deletes item', async () => {
    // create list
    const createRes = await request(app).post('/api/lists').send({ title: 'Тести', owner: 'tester' }).expect(201);
    expect(createRes.body.id).toBeDefined();
    const listId = createRes.body.id;

    // add item
    const itemRes = await request(app).post(`/api/lists/${listId}/items`).send({ name: 'Молоко', quantity: 2, price: 1.5 }).expect(201);
    expect(itemRes.body.id).toBeDefined();
    const itemId = itemRes.body.id;

    // get summary
    const summary = await request(app).get(`/api/lists/${listId}`).expect(200);
    expect(summary.body.items.some((i) => i.id === itemId)).toBe(true);

    // mark purchased
    await request(app).post(`/api/lists/${listId}/items/${itemId}/purchase`).expect(200);
    const after = await request(app).get(`/api/lists/${listId}`).expect(200);
    expect(after.body.items.find((i) => i.id === itemId).status).toBe('purchased');

    // delete item
    await request(app).delete(`/api/lists/${listId}/items/${itemId}`).expect(204);
    const final = await request(app).get(`/api/lists/${listId}`).expect(200);
    expect(final.body.items.some((i) => i.id === itemId)).toBe(false);
  });
});
