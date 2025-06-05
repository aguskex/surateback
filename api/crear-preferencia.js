// api/crear-preferencia.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permiten solicitudes POST' });
  }

  const { nombre, direccion, producto, precio } = req.body;

  const mp = require('mercadopago');
  mp.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
  });

  try {
    const preference = {
      items: [
        {
          title: producto,
          unit_price: Number(precio),
          quantity: 1,
        },
      ],
      back_urls: {
        success: "https://suratemates.shop/gracias.html",
        failure: "https://suratemates.shop/error.html",
      },
      auto_return: "approved",
      metadata: { nombre, direccion },
    };

    const response = await mp.preferences.create(preference);
    return res.status(200).json({ init_point: response.body.init_point });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la preferencia' });
  }
}

