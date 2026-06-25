const express = require('express');
const crypto = require('crypto');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// In-memory history store (max 50, newest first)
let history = [];

function pushHistory(entry) {
  history.unshift({ id: Date.now(), ...entry });
  if (history.length > 50) history.pop();
}

function computeHash(text, algorithm) {
  const algoMap = { sha256: 'sha256', sha512: 'sha512', sha1: 'sha1', md5: 'md5' };
  const algo = algoMap[algorithm.toLowerCase()] || 'sha256';
  return crypto.createHash(algo).update(text, 'utf8').digest('hex');
}

// POST /api/hash/generate
router.post('/hash/generate', (req, res) => {
  const { text, algorithm = 'sha256', salt = '' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  const start = process.hrtime.bigint();
  const input = salt ? salt + text : text;
  const hash = computeHash(input, algorithm);
  const end = process.hrtime.bigint();
  const processingTime = Number(end - start) / 1e6; // ms

  const entry = {
    type: 'generate',
    algorithm: algorithm.toUpperCase(),
    inputPreview: text.length > 60 ? text.slice(0, 60) + '...' : text,
    hash,
    timestamp: new Date().toISOString(),
    processingTime,
  };
  pushHistory(entry);

  res.json({
    hash,
    algorithm: algorithm.toUpperCase(),
    inputLength: text.length,
    outputLength: hash.length,
    processingTime,
  });
});

// POST /api/hash/verify
router.post('/hash/verify', (req, res) => {
  const { text, hash, algorithm = 'sha256', salt = '' } = req.body;

  if (!text || !hash) {
    return res.status(400).json({ error: 'text and hash are required' });
  }

  const start = process.hrtime.bigint();
  const input = salt ? salt + text : text;
  const generatedHash = computeHash(input, algorithm);
  const match = generatedHash.toLowerCase() === hash.toLowerCase();
  const end = process.hrtime.bigint();
  const processingTime = Number(end - start) / 1e6;

  const entry = {
    type: 'verify',
    algorithm: algorithm.toUpperCase(),
    inputPreview: text.length > 60 ? text.slice(0, 60) + '...' : text,
    hash: generatedHash,
    timestamp: new Date().toISOString(),
    processingTime,
  };
  pushHistory(entry);

  res.json({ match, algorithm: algorithm.toUpperCase(), generatedHash, processingTime });
});

// POST /api/hash/file
router.post('/hash/file', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'file is required' });
  }

  const algorithm = (req.body.algorithm || 'sha256').toLowerCase();
  const algoMap = { sha256: 'sha256', sha512: 'sha512', sha1: 'sha1', md5: 'md5' };
  const algo = algoMap[algorithm] || 'sha256';

  const start = process.hrtime.bigint();
  const hash = crypto.createHash(algo).update(req.file.buffer).digest('hex');
  const end = process.hrtime.bigint();
  const processingTime = Number(end - start) / 1e6;

  const entry = {
    type: 'file',
    algorithm: algorithm.toUpperCase(),
    inputPreview: req.file.originalname,
    hash,
    timestamp: new Date().toISOString(),
    processingTime,
  };
  pushHistory(entry);

  res.json({
    hash,
    algorithm: algorithm.toUpperCase(),
    filename: req.file.originalname,
    fileSize: req.file.size,
    mimeType: req.file.mimetype || 'application/octet-stream',
    processingTime,
  });
});

// GET /api/history
router.get('/history', (req, res) => {
  res.json({ history });
});

// DELETE /api/history
router.delete('/history', (req, res) => {
  history = [];
  res.json({ success: true });
});

module.exports = router;
