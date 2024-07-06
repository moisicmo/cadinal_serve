const { request, response } = require("express");
const axios = require('axios');
const { create, convert } = require('xmlbuilder2');
var crypto = require('crypto');

const processPayment = async (req = request, res = response) => {
  try {
    console.log(req.body);
    const {DFReferenceId, card, customer } = req.body;
    // Generar el timestamp en milisegundos
    const timestamp = Math.round(Date.now());
    // referenceId

    // Valores proporcionados
    const OrgUnitId = '';
    const apiKey = '';
    const identifier = '';


    // Crear la cadena a hashear
    const preHash = timestamp + apiKey;
    const hashed = crypto.createHash('sha256').update(preHash).digest();
    const signature = hashed.toString('base64');

    console.log('Timestamp:', timestamp);
    console.log('Signature:', signature);

    // Construir el XML
    const root = create({ version: '1.0' })
      .ele('CardinalMPI')
        .ele('MsgType').txt('cmpi_lookup').up()
        .ele('DeviceChannel').txt('sdk').up()
        .ele('Version').txt('1.7').up()
        .ele('TransactionType').txt('C').up()
        .ele('TransactionMode').txt('S').up()
        .ele('Algorithm').txt('SHA-256').up()
        //
        .ele('DFReferenceId').txt(DFReferenceId).up()
        .ele('Identifier').txt(identifier).up()
        .ele('OrgUnit').txt(OrgUnitId).up()
        .ele('SdkAppId').txt(apiKey).up()
        // 
        .ele('Signature').txt(signature).up()
        .ele('Timestamp').txt(timestamp).up()
        .ele('Amount').txt('1000').up()
        // card
        .ele('CardExpMonth').txt(card.expirationMonth).up()
        .ele('CardExpYear').txt(`20${card.expirationYear}`).up()
        .ele('CardNumber').txt(card.number).up()
        .ele('CurrencyCode').txt('840').up()
        .ele('Email').txt(customer.email).up()
        .ele('MobilePhone').txt('+59173735766').up()
        .ele('OrderNumber').txt('order-0001').up()
        // billing
        .ele('BillingAddress1').txt(customer.address1).up()
        .ele('BillingAddress2').txt(customer.address2).up()
        .ele('BillingCity').txt(customer.locality).up()
        .ele('BillingCountryCode').txt('840').up()
        .ele('BillingFirstName').txt(customer.firstName).up()
        .ele('BillingFullName').txt(`${customer.firstName} ${customer.lastName}`).up()
        .ele('BillingLastName').txt(customer.lastName).up()
        .ele('BillingPostalCode').txt(customer.postalCode).up()
        .ele('BillingState').txt('OH').up()
        // shipping
        .ele('ShippingAddress1').txt('8100 Tyler Blvd').up()
        .ele('ShippingAddress2').txt('').up()
        .ele('ShippingCity').txt('44060').up()
        .ele('ShippingCountryCode').txt('840').up()
        .ele('ShippingPostalCode').txt('44060').up()
        .ele('ShippingState').txt('OH').up()
        
        // challenge
        .ele('ChallengeRenderInterface').txt('03').up()
        .ele('ChallengeRenderType').txt('01').up()
        .ele('ChallengeRenderType').txt('02').up()
        .ele('ChallengeRenderType').txt('03').up()
        .ele('ChallengeRenderType').txt('04').up()
        .ele('ChallengeRenderType').txt('05').up()
      .up();

    const xml = root.end();
    
    const formData = new URLSearchParams();
    formData.append('cmpi_msg', xml);
    
    const response = await axios.post('https://centineltest.cardinalcommerce.com/maps/txns.asp', formData, {
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