import express from 'express';
import { z } from 'zod';
import { execute } from '../utils/shell';
import { ALLORA_CONFIG } from '@shared/allora';

const router = express.Router();

// Schema for topic creation
const CreateTopicSchema = z.object({
  metadata: z.string(),
  epochLength: z.number(),
  groundTruthLag: z.number(),
  workerSubmissionWindow: z.number()
});

// Create a new topic on Allora Network
router.post('/topic', async (req, res) => {
  try {
    const data = CreateTopicSchema.parse(req.body);
    
    // Create topic using allorad CLI
    const command = `allorad tx emissions create-topic \
      ${process.env.ALLORA_WALLET_ADDRESS} \
      "${data.metadata}" \
      "mse" \
      ${data.epochLength} \
      ${data.groundTruthLag} \
      ${data.workerSubmissionWindow} \
      3 \
      1 \
      true \
      0.001 \
      0.1 \
      0.25 \
      0.25 \
      0.25 \
      --node ${ALLORA_CONFIG.RPC_URL} \
      --chain-id ${ALLORA_CONFIG.CHAIN_ID}`;

    const result = await execute(command);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error creating Allora topic:', error);
    res.status(500).json({ 
      error: 'Failed to create topic',
      details: error.message 
    });
  }
});

// Get topic data
router.get('/topic/:id', async (req, res) => {
  try {
    const command = `allorad q emissions topic ${req.params.id} --node ${ALLORA_CONFIG.RPC_URL}`;
    const result = await execute(command);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ 
      error: 'Failed to fetch topic',
      details: error.message 
    });
  }
});

// Fund a topic
router.post('/topic/:id/fund', async (req, res) => {
  try {
    const { amount } = req.body;
    const command = `allorad tx emissions fund-topic \
      ${process.env.ALLORA_WALLET_ADDRESS} \
      ${req.params.id} \
      ${amount} \
      "" \
      --node ${ALLORA_CONFIG.RPC_URL} \
      --chain-id ${ALLORA_CONFIG.CHAIN_ID}`;

    const result = await execute(command);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Error funding topic:', error);
    res.status(500).json({ 
      error: 'Failed to fund topic',
      details: error.message 
    });
  }
});

export default router;
