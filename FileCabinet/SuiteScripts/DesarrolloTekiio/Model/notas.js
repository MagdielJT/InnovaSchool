let notas = require("./notas.json")
// let notas = {
//     "data": [
//         {
//             "recordType": "creditmemo",
//             "id": "39282",
//             "values": {
//                 "ordertype": [],
//                 "mainline": "*",
//                 "trandate": "09/01/2020",
//                 "asofdate": "",
//                 "postingperiod": [
//                     {
//                         "value": "113",
//                         "text": "Sep 2020"
//                     }
//                 ],
//                 "taxperiod": [
//                     {
//                         "value": "131",
//                         "text": "Sep 2020"
//                     }
//                 ],
//                 "type": [
//                     {
//                         "value": "CustCred",
//                         "text": "Nota de crédito"
//                     }
//                 ],
//                 "tranid": "NCCEH31",
//                 "entity": [
//                     {
//                         "value": "9312",
//                         "text": "CLI1404 ANA LILIA RODRIGUEZ CASTILLO"
//                     }
//                 ],
//                 "account": [
//                     {
//                         "value": "122",
//                         "text": "105-001-000 Clientes : Clientes nacionales"
//                     }
//                 ],
//                 "memo": "",
//                 "amount": "-3383.75",
//                 "custbody_efx_alumno": [
//                     {
//                         "value": "5565",
//                         "text": "CLI1404:2 ANA LILIA RODRIGUEZ CASTILLO : SANTIAGO RODRIGO CRUZ RODRIGUEZ"
//                     }
//                 ],
//                 "appliedtotransaction": [
//                     {
//                         "value": "29791",
//                         "text": "Factura de venta #FACCEH3153"
//                     }
//                 ],
//                 "item": [],
//                 "createdfrom": [
//                     {
//                         "value": "29791",
//                         "text": "Factura de venta #FACCEH3153"
//                     }
//                 ],
//                 "reimbursableamount": "3383.75"
//             }
//         },
//         {
//             "recordType": "creditmemo",
//             "id": "39282",
//             "values": {
//                 "ordertype": [],
//                 "mainline": "*",
//                 "trandate": "09/01/2020",
//                 "asofdate": "",
//                 "postingperiod": [
//                     {
//                         "value": "113",
//                         "text": "Sep 2020"
//                     }
//                 ],
//                 "taxperiod": [
//                     {
//                         "value": "131",
//                         "text": "Sep 2020"
//                     }
//                 ],
//                 "type": [
//                     {
//                         "value": "CustCred",
//                         "text": "Nota de crédito"
//                     }
//                 ],
//                 "tranid": "NCCEH31",
//                 "entity": [
//                     {
//                         "value": "9312",
//                         "text": "CLI1404 ANA LILIA RODRIGUEZ CASTILLO"
//                     }
//                 ],
//                 "account": [
//                     {
//                         "value": "122",
//                         "text": "105-001-000 Clientes : Clientes nacionales"
//                     }
//                 ],
//                 "memo": "",
//                 "amount": "-3383.75",
//                 "custbody_efx_alumno": [
//                     {
//                         "value": "5565",
//                         "text": "CLI1404:2 ANA LILIA RODRIGUEZ CASTILLO : SANTIAGO RODRIGO CRUZ RODRIGUEZ"
//                     }
//                 ],
//                 "appliedtotransaction": [
//                     {
//                         "value": "29791",
//                         "text": "Factura de venta #FACCEH3153"
//                     }
//                 ],
//                 "item": [],
//                 "createdfrom": [
//                     {
//                         "value": "29791",
//                         "text": "Factura de venta #FACCEH3153"
//                     }
//                 ],
//                 "reimbursableamount": "3383.75"
//             }
//         },
//         {
//             "recordType": "creditmemo",
//             "id": "41226",
//             "values": {
//                 "ordertype": [],
//                 "mainline": "*",
//                 "trandate": "09/01/2020",
//                 "asofdate": "",
//                 "postingperiod": [
//                     {
//                         "value": "113",
//                         "text": "Sep 2020"
//                     }
//                 ],
//                 "taxperiod": [
//                     {
//                         "value": "131",
//                         "text": "Sep 2020"
//                     }
//                 ],
//                 "type": [
//                     {
//                         "value": "CustCred",
//                         "text": "Nota de crédito"
//                     }
//                 ],
//                 "tranid": "NCCEH32",
//                 "entity": [
//                     {
//                         "value": "9318",
//                         "text": "CLI1410 CRISTIÁN SANCHEZ CARDOSO"
//                     }
//                 ],
//                 "account": [
//                     {
//                         "value": "122",
//                         "text": "105-001-000 Clientes : Clientes nacionales"
//                     }
//                 ],
//                 "memo": "",
//                 "amount": "-3299.94",
//                 "custbody_efx_alumno": [
//                     {
//                         "value": "5591",
//                         "text": "CLI1410:1 CRISTIÁN SANCHEZ CARDOSO : LEONARDO VICENTE SANCHEZ BONILLA"
//                     }
//                 ],
//                 "appliedtotransaction": [
//                     {
//                         "value": "29500",
//                         "text": "Factura de venta #FACCEH2980"
//                     }
//                 ],
//                 "item": [],
//                 "createdfrom": [
//                     {
//                         "value": "29500",
//                         "text": "Factura de venta #FACCEH2980"
//                     }
//                 ],
//                 "reimbursableamount": "3299.94"
//             }
//         },
//         {
//             "recordType": "creditmemo",
//             "id": "48379",
//             "values": {
//                 "ordertype": [],
//                 "mainline": "*",
//                 "trandate": "10/01/2020",
//                 "asofdate": "",
//                 "postingperiod": [
//                     {
//                         "value": "115",
//                         "text": "Oct 2020"
//                     }
//                 ],
//                 "taxperiod": [
//                     {
//                         "value": "133",
//                         "text": "Oct 2020"
//                     }
//                 ],
//                 "type": [
//                     {
//                         "value": "CustCred",
//                         "text": "Nota de crédito"
//                     }
//                 ],
//                 "tranid": "NCSAT8",
//                 "entity": [
//                     {
//                         "value": "5732",
//                         "text": "CLI1332 MIGUEL ÁNGEL GALINDO GOMEZ"
//                     }
//                 ],
//                 "account": [
//                     {
//                         "value": "122",
//                         "text": "105-001-000 Clientes : Clientes nacionales"
//                     }
//                 ],
//                 "memo": "Devolución por baja",
//                 "amount": "-3600.00",
//                 "custbody_efx_alumno": [
//                     {
//                         "value": "5733",
//                         "text": "CLI1332:1 MIGUEL ÁNGEL GALINDO GOMEZ : SARA GALINDO CHAVEZ"
//                     }
//                 ],
//                 "appliedtotransaction": [
//                     {
//                         "value": "48383",
//                         "text": "Reembolso al cliente #750"
//                     }
//                 ],
//                 "item": [],
//                 "createdfrom": [
//                     {
//                         "value": "14239",
//                         "text": "Factura de venta #FACSAT1282"
//                     }
//                 ],
//                 "reimbursableamount": "3600.00"
//             }
//         },
//         {
//             "recordType": "creditmemo",
//             "id": "41226",
//             "values": {
//                 "ordertype": [],
//                 "mainline": "*",
//                 "trandate": "09/01/2020",
//                 "asofdate": "",
//                 "postingperiod": [
//                     {
//                         "value": "113",
//                         "text": "Sep 2020"
//                     }
//                 ],
//                 "taxperiod": [
//                     {
//                         "value": "131",
//                         "text": "Sep 2020"
//                     }
//                 ],
//                 "type": [
//                     {
//                         "value": "CustCred",
//                         "text": "Nota de crédito"
//                     }
//                 ],
//                 "tranid": "NCCEH32",
//                 "entity": [
//                     {
//                         "value": "9318",
//                         "text": "CLI1410 CRISTIÁN SANCHEZ CARDOSO"
//                     }
//                 ],
//                 "account": [
//                     {
//                         "value": "122",
//                         "text": "105-001-000 Clientes : Clientes nacionales"
//                     }
//                 ],
//                 "memo": "",
//                 "amount": "-3299.94",
//                 "custbody_efx_alumno": [
//                     {
//                         "value": "5591",
//                         "text": "CLI1410:1 CRISTIÁN SANCHEZ CARDOSO : LEONARDO VICENTE SANCHEZ BONILLA"
//                     }
//                 ],
//                 "appliedtotransaction": [
//                     {
//                         "value": "29500",
//                         "text": "Factura de venta #FACCEH2980"
//                     }
//                 ],
//                 "item": [],
//                 "createdfrom": [
//                     {
//                         "value": "29500",
//                         "text": "Factura de venta #FACCEH2980"
//                     }
//                 ],
//                 "reimbursableamount": "3299.94"
//             }
//         }
//     ]
// }
console.log (notas.data.length) // 5411
let cont = 0
let notasCreditoDesde = {}
let notasPorCliente = {}
let reembolsos = {}
notas["data"].map(currentRange => {
    let idNC = currentRange.id // currentRange[j].id Cambiara dependiendo la posicion J
    let result  = currentRange.values

    if( !result.custbody_efx_alumno[0])
        return
    if( result.createdfrom.length <= 0 )
        return
    
    let alumnoId = result.custbody_efx_alumno[0].value
    let creadaDesde = result.createdfrom[0].text
    let creadaDesdeId = result.createdfrom[0].value
    let aplicadaA = result.appliedtotransaction[0].text
    let aplicadaAId = result.appliedtotransaction[0].value
    let main = result.mainline
    let tranid = result.tranid
    let trandate = result.trandate
    let amount = result.amount
    
    if(!(alumnoId in notasPorCliente)){
        notasPorCliente[alumnoId] = []
    }
    
    if(!(creadaDesdeId in notasCreditoDesde)){
        notasCreditoDesde[creadaDesdeId] = []
        
    }
    
    if(!(creadaDesdeId in notasPorCliente[alumnoId])){
        notasPorCliente[alumnoId][creadaDesdeId] = {}
    }

    notasCreditoDesde[creadaDesdeId].push({
        docNumber: tranid,
        date: trandate,
        invoice: creadaDesde,
        amount: (amount * -1 ),
    })

    if(aplicadaA.includes("Reembolso al cliente ")){
        if(!(creadaDesdeId in reembolsos))
            reembolsos[creadaDesdeId] = []

        reembolsos[creadaDesdeId].push({
            docNumber: aplicadaA,
            date: trandate,
            amount : (amount * -1 )
        })
    }
})


Object.keys(notasCreditoDesde).map(element => {
    if(element in reembolsos){
        notasCreditoDesde[element]["return"] = reembolsos[element]
    }
})

Object.keys(notasPorCliente).map( element => {
    Object.keys(notasCreditoDesde).map( elementFac => {
        if( elementFac in notasPorCliente[element] ){
            notasPorCliente[element][elementFac] = notasCreditoDesde[elementFac]
        }
    })
})

// console.log(notasCreditoDesde)
console.log(notasPorCliente)
// Ejemplo de estructura 


/**
 * 
 * {
 *      ClienteID : {
 *             FacturaID : [
 *                  {
 *                      creadaDesdeID: "",
 *                      aplicadaA: [],
 *                      aplicadaAID: "",
 *                      creadaDesde:[
 *                          {
                                "docNumber": "NC001",
                                "date": "08/23/2021",
                                "invoice": "Factura de venta #FACSAT39419",
                                "amount": "50.00",
                                "return" : [
                                    {
                                        "docNumber": "CUSTRFND98",
                                        "date": "08/23/2021",
                                        "amount" :"25.00"
                                    }
                                ]
                            }
 *                      ]
 *                  }
 *              ]        
 *      }
 * }
 * 
 */
                        