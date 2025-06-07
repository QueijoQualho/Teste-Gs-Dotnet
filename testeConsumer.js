const express = require('express');
const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.get('/markers', async (req, res) => {
  const requestQueue = 'get-markers-request-queue';
  const correlationId = uuidv4();
  const messageId = uuidv4();

  try {
    const connection = await amqp.connect('amqp://rabbitmq-aci-watchtower.brazilsouth.azurecontainer.io');
    const channel = await connection.createChannel();

    const { queue: replyQueue } = await channel.assertQueue('', { exclusive: true });

    const payload = {
      message: {
        RequestId: correlationId
      },
      messageType: [
        "urn:message:MlNetService.App.Dtos.Messaging.GetMarkersRequest"
      ]
    };

    await channel.bindQueue(replyQueue, 'MlNetService.App.Dtos.Messaging:GetMarkersResponse', '');

    const timeout = setTimeout(async () => {
      await channel.close();
      await connection.close();
      res.status(504).json({ error: 'Timeout esperando resposta do serviço RabbitMQ' });
    }, 10000); // 10 segundos

    await channel.consume(replyQueue, async (msg) => {
      if (msg) {
        clearTimeout(timeout);
        const envelope = JSON.parse(msg.content.toString());
        const response = envelope.message || envelope;
        channel.ack(msg);
        await channel.close();
        await connection.close();
        res.json(response);
      }
    }, { noAck: false });

    channel.sendToQueue(
      requestQueue,
      Buffer.from(JSON.stringify(payload)),
      {
        contentType: 'application/json',
        correlationId,
        messageId,
        replyTo: replyQueue,
        headers: {
          messageType: payload.messageType
        }
      }
    );
  } catch (err) {
    console.error('Erro ao enviar/receber do RabbitMQ:', err);
    res.status(500).json({ error: 'Erro ao enviar ou receber dados do RabbitMQ' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
