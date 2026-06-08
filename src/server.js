import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createShoppingApplication } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  const { service } = createShoppingApplication();

  app.get('/api/lists', (req, res) => {
    const lists = service.listRepository.findAll().map((l) => l.toJSON());
    res.json(lists);
  });

  app.post('/api/lists', (req, res) => {
    try {
      const { title, owner } = req.body;
      const created = service.createList({ title, owner });
      res.status(201).json(created.toJSON());
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get('/api/lists/:id', (req, res) => {
    try {
      const summary = service.getListSummary(req.params.id);
      res.json(summary);
    } catch (e) {
      res.status(404).json({ error: e.message });
    }
  });

  app.post('/api/lists/:id/items', (req, res) => {
    try {
      const item = service.addItem(req.params.id, req.body);
      res.status(201).json(item.toJSON());
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post('/api/lists/:id/items/:itemId/purchase', (req, res) => {
    try {
      const item = service.markPurchased(req.params.id, req.params.itemId);
      res.json(item.toJSON());
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete('/api/lists/:id/items/:itemId', (req, res) => {
    try {
      service.removeItem(req.params.id, req.params.itemId);
      res.status(204).end();
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

  return app;
}

const port = process.env.PORT || 3000;
const app = buildApp();

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Shopping web app listening at http://localhost:${port}`);
  });
}

export default app;
