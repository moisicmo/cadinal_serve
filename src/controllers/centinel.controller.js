const { request, response } = require("express");
const axios = require('axios');
const { create, convert } = require('xmlbuilder2');
var crypto = require('crypto');

const processPayment = async (req = request, res = response) => {
  try {

    const DFReferenceId = req.body.DFReferenceId;
    const OrgUnitId = '';
    // Generar el timestamp en milisegundos
    const timestamp = Math.round(Date.now());
    // Valores proporcionados
    const apiKey = '';
    const identifier = '';
    // Crear la cadena a hashear
    const preHash = timestamp + apiKey;
    // Crear el hash SHA-256
    const hashed = crypto.createHash('sha256').update(preHash).digest();
    // Codificar en base64
    const signature = hashed.toString('base64');

    console.log('Timestamp:', timestamp);
    console.log('Signature:', signature);
    console.log('DFReferenceId:', DFReferenceId);

    // Construir el XML
    const root = create({ version: '1.0' })
      .ele('CardinalMPI')
        .ele('MsgType').txt('cmpi_lookup').up()
        .ele('Version').txt('1.7').up()
        .ele('TransactionType').txt('C').up()
        .ele('TransactionMode').txt('S').up()
        .ele('DeviceChannel').txt('SDK').up()
        .ele('Algorithm').txt('SHA-256').up()
        //
        .ele('DFReferenceId').txt(DFReferenceId).up()
        .ele('Identifier').txt(identifier).up()
        .ele('OrgUnit').txt(OrgUnitId).up()
        .ele('SdkAppId').txt(apiKey).up()
        // 
        .ele('Signature').txt(signature).up()
        .ele('Timestamp').txt(timestamp).up()
        .ele('OrderNumber').txt('order-0001').up()
        .ele('Amount').txt('1000').up()
        .ele('CurrencyCode').txt('840').up()
        // card
        .ele('CardNumber').txt('4000000000002503').up()
        .ele('CardExpMonth').txt('01').up()
        .ele('CardExpYear').txt('2026').up()
        // billing
        .ele('BillingAddress1').txt('Ludovico ').up()
        .ele('BillingCity').txt('Mentor').up()
        .ele('BillingCountryCode').txt('840').up()
        .ele('BillingFirstName').txt('test1').up()
        .ele('BillingLastName').txt('').up()
        .ele('BillingPhone').txt('').up()
        .ele('BillingPostalCode').txt('44060').up()
        .ele('BillingState').txt('OH').up()
        // shipping
        .ele('ShippingAddress1').txt('').up()
        .ele('ShippingCity').txt('44060').up()
        .ele('ShippingCountryCode').txt('840').up()
        .ele('ShippingFirstName').txt('MOI').up()
        .ele('ShippingLastName').txt('as').up()
        .ele('ShippingMethodIndicator').txt('').up()
        .ele('ShippingPostalCode').txt('44060').up()
        .ele('ShippingState').txt('OH').up()
        .ele('ShippingPhone').txt('').up()
        // .ele('ShippingAmount').txt('').up()
        .ele('MobilePhone').txt('').up()
        .ele('Email').txt('').up()
        // challenge
        .ele('ChallengeRenderInterface').txt('01').up()
        .ele('ChallengeRenderType').txt('01').up()
        .ele('ChallengeRenderType').txt('02').up()
        .ele('ChallengeRenderType').txt('03').up()
        // .ele('ChallengeRenderType').txt('04').up()
        // .ele('ChallengeRenderType').txt('05').up()
      .up();

    const xml = root.end();
    
    const formData = new URLSearchParams();
    formData.append('cmpi_msg', xml);
    
    const response = await axios.post('', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const result = convert(response.data, { format: "object" });
    console.log(result)
    
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
      message: error.message
    });
  }
};

module.exports = {
  processPayment,
};
