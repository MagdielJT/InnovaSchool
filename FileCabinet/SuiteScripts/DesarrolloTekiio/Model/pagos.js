const pagos = require("./pagos.json")
// let pagosPorAlumnos = {}
// let pagosPorFactura = {}
// let listaPagosAplicados = {}

// valores["data"].forEach(currentRange => {
//     let result = currentRange.values
//     if ('0' in result["custbody_efx_alumno"])
//     {
//         var alumnoId = result.custbody_efx_alumno['0'].value
//         // var padreId = result.entity['0'].value
//         var internalId = currentRange.id
//     }else{
//         return
//     }
//     let mainline = result.mainline
//     let trandate = result.trandate
//     let postingperiod = ''
//     if('0' in result.postingperiod)
//         postingperiod = result.postingperiod['0'].text
//     let tranid = result.tranid
//     let appliedtotransaction = ''
//     if ('0' in result.appliedtotransaction)
//         appliedtotransaction = result.appliedtotransaction['0'].text
//     let appliedtotransactionID = ''
//     if ('0' in result.appliedtotransaction)
//         appliedtotransactionID = result.appliedtotransaction['0'].value
//     let account = ''
//     if('0' in result.account) 
//         account = result.account['0'].text
//     let amount = result.amount
//     let appliedtolinkamount = result.appliedtolinkamount

//     if (mainline == "*"){
//         pagosPorFactura[internalId] = {
//                 docNumber: tranid,
//                 date: trandate,
//                 amount: amount
//             }
//     }else{
//         if(!(internalId in listaPagosAplicados))
//             listaPagosAplicados[internalId] = []
        
//         listaPagosAplicados[internalId].push(
//             {
//                 invoice : appliedtotransaction,
//                 amount : appliedtolinkamount
//             }
//         ) 
//     }
//     if( !(alumnoId in pagosPorAlumnos) )
//         pagosPorAlumnos[alumnoId] = {}
    
//     pagosPorAlumnos[alumnoId][internalId] = []
    

// } )

// Object.keys(pagosPorFactura).map(element =>{
//     pagosPorFactura[element].invoice = listaPagosAplicados[element]
// })
// Object.keys(pagosPorAlumnos).map(element2 => {
//     Object.keys(pagosPorAlumnos[element2]).map(element => {
//         if(element in pagosPorFactura)
//             pagosPorAlumnos[element2][element].push(pagosPorFactura[element])
//     })
// })
// console.log(pagosPorAlumnos)
// return pagosPorAlumnos

let key = "1741"
let value = {
    "idstudent": "1741",
    "idprospuectus": "173",
    "studentStatus": "Activo",
    "studentName": "CLI9:1 DANIEL HIDALGO OLGUIN : FÁTIMA HIDALGO FACIO",
    "idtutor": "641",
    "tutorName": "CLI9 DANIEL HIDALGO OLGUIN",
    "campus": "Esperanza",
    "outstanding": 141.01,
    "pastDueBalance": 141.01,
    "positiveBalance": 0,
    "transactions": [
        {
            "status": "Pagada",
            "idtransaction": "15854",
            "notransaction": "V 1223",
            "period": "Aug 2020",
            "date": "08/31/2020",
            "totalamount": "1.00",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "Sín documento PDF",
                    "urlxml": "Sín documento certificado"
                }
            ],
            "items": [
                {
                    "item": "Libros - venta",
                    "quantity": "1",
                    "amount": "1.00",
                    "description": "Libros - venta"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "15959",
            "notransaction": "V 1040",
            "period": "Aug 2020",
            "date": "08/31/2020",
            "totalamount": "2341.00",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "Sín documento PDF",
                    "urlxml": "Sín documento certificado"
                }
            ],
            "items": [
                {
                    "item": "Libros - venta",
                    "quantity": "1",
                    "amount": "2341.00",
                    "description": "Libros - venta"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "20290",
            "notransaction": "9825",
            "period": "Aug 2020",
            "date": "08/29/2020",
            "totalamount": "3033.45",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "Sín documento PDF",
                    "urlxml": "Sín documento certificado"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": "3033.45",
                    "description": ""
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "37625",
            "notransaction": "FACSAT4316",
            "period": "Sep 2020",
            "date": "09/01/2020",
            "totalamount": "235.93",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=12613",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=12612&des=1"
                }
            ],
            "items": [
                {
                    "item": "Subtotal",
                    "quantity": "",
                    "amount": "243.23",
                    "description": ""
                },
                {
                    "item": "Colegiatura",
                    "quantity": "1",
                    "amount": "270.26",
                    "description": ""
                },
                {
                    "item": "Descuento contingencia 10%",
                    "quantity": "",
                    "amount": "-27.03",
                    "description": "Descuento comercial para cualquier estudiante sobre el valor de la colegiatura de cada escuela"
                },
                {
                    "item": "Descuento PP 3%",
                    "quantity": "",
                    "amount": "-7.30",
                    "description": "Descuento comercial para cualquier estudiante sobre el valor de la colegiatura de cada escuela"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "37626",
            "notransaction": "FACSAT4317",
            "period": "Sep 2020",
            "date": "09/02/2020",
            "totalamount": "101.07",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=12615",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=12614&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": "101.07",
                    "description": ""
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "40623",
            "notransaction": "FACSAT4619",
            "period": "Oct 2020",
            "date": "10/06/2020",
            "totalamount": "3167.32",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=13761",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=13760&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": "3167.32",
                    "description": "Colegiatura Cobrada en Octubre 2020"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "41885",
            "notransaction": "FACSAT4956",
            "period": "Oct 2020",
            "date": "10/29/2020",
            "totalamount": "3370.50",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=15012",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=15011&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": "3370.50",
                    "description": "Colegiatura Cobrada en Octubre 2020\n"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "54917",
            "notransaction": "FACSAT6804",
            "period": "Dec 2020",
            "date": "12/01/2020",
            "totalamount": "3278.38",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=21674",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=21673&des=1"
                }
            ],
            "items": [
                {
                    "item": "Subtotal",
                    "quantity": "",
                    "amount": "3370.50",
                    "description": ""
                },
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": "9.00",
                    "description": ""
                },
                {
                    "item": "Colegiatura",
                    "quantity": "1",
                    "amount": "3745.00",
                    "description": "Colegiatura Diciembre 2020\n"
                },
                {
                    "item": "Descuento PP 3%",
                    "quantity": "",
                    "amount": "-101.12",
                    "description": "Descuento comercial para cualquier estudiante sobre el valor de la colegiatura de cada escuela"
                },
                {
                    "item": "Descuento contingencia 10%",
                    "quantity": "",
                    "amount": "-374.50",
                    "description": "Descuento comercial para cualquier estudiante sobre el valor de la colegiatura de cada escuela"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "58405",
            "notransaction": "FACSAT7704",
            "period": "Dec 2020",
            "date": "12/17/2020",
            "totalamount": "4045.00",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=24407",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=24406&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": "4045.00",
                    "description": "Colegiatura Septiembre Ciclo 2021-2022"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "69528",
            "notransaction": "FACSAT9155",
            "period": "feb 2021",
            "date": "02/05/2021",
            "totalamount": "1601.08",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=31267",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=31266&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": "1601.08",
                    "description": "Colegiatura Cobrada Febrero 2021"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "72294",
            "notransaction": "FACSAT9633",
            "period": "mar 2021",
            "date": "03/01/2021",
            "totalamount": "2800.00",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=33124",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=33123&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": "2800.00",
                    "description": "Colegiatura Cobrada Marzo   2021\n"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "83173",
            "notransaction": "FACSAT11828",
            "period": "abr 2021",
            "date": "04/02/2021",
            "totalamount": "2104.08",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=39036",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=39035&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": "2104.08",
                    "description": "Colegiatura cobrada en Abril 2021"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "85228",
            "notransaction": "FACSAT12105",
            "period": "may 2021",
            "date": "05/05/2021",
            "totalamount": "2452.04",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=41972",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=41971&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": ".01",
                    "description": ""
                },
                {
                    "item": "Subtotal",
                    "quantity": "",
                    "amount": "2527.87",
                    "description": ""
                },
                {
                    "item": "Subtotal",
                    "quantity": "",
                    "amount": "3370.50",
                    "description": ""
                },
                {
                    "item": "Beca SEP 25%",
                    "quantity": "",
                    "amount": "-842.63",
                    "description": "Beca otorgada por la SEP sobre la colegiatura de cada escuela"
                },
                {
                    "item": "Colegiatura",
                    "quantity": "1",
                    "amount": "3745.00",
                    "description": "Colegiatura correspondiente al mes de mayo del 2021"
                },
                {
                    "item": "Descuento contingencia 10%",
                    "quantity": "",
                    "amount": "-374.50",
                    "description": "Descuento comercial para cualquier estudiante sobre el valor de la colegiatura de cada escuela"
                },
                {
                    "item": "Descuento PP 3%",
                    "quantity": "",
                    "amount": "-75.84",
                    "description": "Descuento comercial para cualquier estudiante sobre el valor de la colegiatura de cada escuela"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "96582",
            "notransaction": "FACSAT13941",
            "period": "jul 2021",
            "date": "07/02/2021",
            "totalamount": "2527.87",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=47387",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=47386&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": "2527.87",
                    "description": "Colegiatura cobrada en Julio 2021\n"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "115229",
            "notransaction": "FACSAT17794",
            "period": "sep 2021",
            "date": "09/24/2021",
            "totalamount": "2674.00",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=71360",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=71359&des=1"
                }
            ],
            "items": [
                {
                    "item": "Libros - venta",
                    "quantity": "1",
                    "amount": "2674.00",
                    "description": "Libros ciclo escolar 2021-2022\n"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "115313",
            "notransaction": "FACSAT17832",
            "period": "sep 2021",
            "date": "09/06/2021",
            "totalamount": "4045.00",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=58369",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=58368&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": "4045.00",
                    "description": " Colegiatura cobrada en Septiembre 2021 \n"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "117239",
            "notransaction": "FACSAT18294",
            "period": "oct 2021",
            "date": "10/01/2021",
            "totalamount": "3923.65",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=61071",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=61070&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura",
                    "quantity": "1",
                    "amount": "4045.00",
                    "description": "Colegiatura correspondiente al mes Octubre del 2021"
                },
                {
                    "item": "Descuento PP 3%",
                    "quantity": "",
                    "amount": "-121.35",
                    "description": "Descuento comercial para cualquier estudiante sobre el valor de la colegiatura de cada escuela"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "124757",
            "notransaction": "FACSAT20118",
            "period": "nov 2021",
            "date": "11/01/2021",
            "totalamount": "3923.65",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=66693",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=66692&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura",
                    "quantity": "1",
                    "amount": "4045.00",
                    "description": "Colegiatura correspondiente al mes de Noviembre del 2021"
                },
                {
                    "item": "Descuento PP 3%",
                    "quantity": "",
                    "amount": "-121.35",
                    "description": "Descuento comercial para cualquier estudiante sobre el valor de la colegiatura de cada escuela"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "132865",
            "notransaction": "FACSAT21881",
            "period": "dic 2021",
            "date": "12/01/2021",
            "totalamount": ".40",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=70684",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=70683&des=1"
                }
            ],
            "items": [
                {
                    "item": "Subtotal",
                    "quantity": "",
                    "amount": ".40",
                    "description": ""
                },
                {
                    "item": "Beca Sep 100%",
                    "quantity": "",
                    "amount": "-4044.60",
                    "description": "Beca otorgada por la SEP sobre la colegiatura de cada escuela"
                },
                {
                    "item": "Colegiatura",
                    "quantity": "1",
                    "amount": "4045.00",
                    "description": "Colegiatura correspondiente al mes de Diciembre del 2021"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "136821",
            "notransaction": "FACSAT23488",
            "period": "dic 2021",
            "date": "12/06/2021",
            "totalamount": "4045.00",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=71779",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=71777&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegitura A  SEP 2022",
                    "quantity": "1",
                    "amount": "4045.00",
                    "description": "Colegiatura correspondiente Septiembre  Ciclo Escolar 2022-2023"
                },
                {
                    "item": "Descuento de Reinscripción",
                    "quantity": "",
                    "amount": "-5450.00",
                    "description": "Descuento Inscripción"
                },
                {
                    "item": "Reinscipción",
                    "quantity": "1",
                    "amount": "5450.00",
                    "description": "Reinscripción correspondiente al Ciclo escolar 2022 - 2023"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "140783",
            "notransaction": "FACSAT24272",
            "period": "dic 2021",
            "date": "12/16/2021",
            "totalamount": "105.00",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=75441",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=75440&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegitura A  SEP 2022",
                    "quantity": "1",
                    "amount": "105.00",
                    "description": "Colegiatura correspondiente Septiembre  Ciclo Escolar 2022-2023"
                },
                {
                    "item": "Descuento de Reinscripción",
                    "quantity": "",
                    "amount": "-105.00",
                    "description": "Descuento Inscripción"
                },
                {
                    "item": "Reinscipción",
                    "quantity": "1",
                    "amount": "105.00",
                    "description": "Reinscripción correspondiente al Ciclo escolar 2022 - 2023"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "151399",
            "notransaction": "FACSAT26489",
            "period": "feb 2022",
            "date": "02/01/2022",
            "totalamount": "2942.74",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=81671",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=81670&des=1"
                }
            ],
            "items": [
                {
                    "item": "Beca SEP 25%",
                    "quantity": "",
                    "amount": "-1011.25",
                    "description": "Colegiatura correspondiente al mes de Febrero del 2022"
                },
                {
                    "item": "Subtotal",
                    "quantity": "",
                    "amount": "3033.75",
                    "description": "Colegiatura correspondiente al mes de Febrero del 2022"
                },
                {
                    "item": "Colegiatura",
                    "quantity": "1",
                    "amount": "4045.00",
                    "description": "Colegiatura correspondiente al mes de Febrero del 2022"
                },
                {
                    "item": "Descuento PP 3%",
                    "quantity": "",
                    "amount": "-91.01",
                    "description": "Descuento comercial para cualquier estudiante sobre el valor de la colegiatura de cada escuela"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "160713",
            "notransaction": "FACSAT28559",
            "period": "mar 2022",
            "date": "03/01/2022",
            "totalamount": "2942.74",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=86650",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=86645&des=1"
                }
            ],
            "items": [
                {
                    "item": "Subtotal",
                    "quantity": "",
                    "amount": "3033.75",
                    "description": ""
                },
                {
                    "item": "Beca SEP 25%",
                    "quantity": "",
                    "amount": "-1011.25",
                    "description": "Beca otorgada por la SEP sobre la colegiatura de cada escuela"
                },
                {
                    "item": "Colegiatura",
                    "quantity": "1",
                    "amount": "4045.00",
                    "description": "Colegiatura correspondiente al mes de Marzo del 2022"
                },
                {
                    "item": "Descuento PP 3%",
                    "quantity": "",
                    "amount": "-91.01",
                    "description": "Descuento comercial para cualquier estudiante sobre el valor de la colegiatura de cada escuela"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "178049",
            "notransaction": "FACSAT32634",
            "period": "abr 2022",
            "date": "04/01/2022",
            "totalamount": "1900.00",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=[object Object]",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=[object Object]&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": "1900.00",
                    "description": "Colegiatura correspondiente al ciclo escolar 2021-2022"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "181966",
            "notransaction": "FACSAT34169",
            "period": "may 2022",
            "date": "05/02/2022",
            "totalamount": "2883.21",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=[object Object]",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=[object Object]&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": "2883.21",
                    "description": "Colegiatura correspondiente al ciclo escolar 2021-2022\n"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Pagada",
            "idtransaction": "186873",
            "notransaction": "FACSAT34725",
            "period": "may 2022",
            "date": "05/26/2022",
            "totalamount": "2942.74",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "documents": [
                {
                    "urlpdf": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=[object Object]",
                    "urlxml": "https://5641232-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1111&deploy=1&compid=5641232_SB1&h=a94241f21672f0c099c2&docID=[object Object]&des=1"
                }
            ],
            "items": [
                {
                    "item": "Colegiatura A",
                    "quantity": "1",
                    "amount": "2942.74",
                    "description": "Colegiatura correspondiente al ciclo escolar 2021-2022"
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Abierta",
            "idtransaction": "196051",
            "notransaction": "FACSAT38408",
            "period": "jun 2022",
            "date": "06/01/2022",
            "totalamount": "3033.75",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "limiteDePago": {
                "ultimoDia": "10",
                "mes": "7",
                "porcentaje": "5.0%"
            },
            "items": [
                {
                    "item": "Colegiatura",
                    "itemId": "168",
                    "quantity": "1",
                    "amount": "4045.00",
                    "description": "Colegiatura correspondiente al mes Junio"
                },
                {
                    "item": "Beca SEP 25%",
                    "itemId": "4404",
                    "quantity": "",
                    "amount": "-1011.25",
                    "description": "Beca otorgada por la SEP sobre la colegiatura de cada escuela"
                },
                {
                    "item": "Subtotal",
                    "itemId": "-2",
                    "quantity": "",
                    "amount": "3033.75",
                    "description": ""
                }
            ],
            "creditNotes": [],
            "payments": []
        },
        {
            "status": "Abierta",
            "idtransaction": "203346",
            "notransaction": "FACSAT39419",
            "period": "jul 2022",
            "date": "07/16/2022",
            "totalamount": "50.00",
            "totalrecharge": 0,
            "detailsrecharge": [],
            "limiteDePago": {
                "ultimoDia": "10",
                "mes": "7",
                "porcentaje": "5.0%"
            },
            "items": [
                {
                    "item": "Colegiatura A",
                    "itemId": "589",
                    "quantity": "1",
                    "amount": "50.00",
                    "description": ""
                }
            ],
            "creditNotes": [],
            "payments": []
        }
    ]
}
// 33267
value.transactions.map( factura => {
    // console.log(factura.idtransaction)

    if( key in pagos ){
        let datosPagos = pagos[key]
        Object.keys(datosPagos).map(element => {
            datosPagos[element].map( (ico, n) => {
                let cadaId = datosPagos[element][n].invoice
                // console.log(datosPagos[element][n])
                cadaId.map( i => {
                    if( factura.idtransaction == i.id){
                        // datosPagos[element][n].amount = i.amount
                        // datosPagos[element][n].invoice = i.invoice
                        // console.log(cadaId)
                        factura["payments"].push({
                            docNumber: datosPagos[element][n].docNumber,
                            date: datosPagos[element][n].date,
                            amount: i.amount,
                            invoice: i.invoice
                        })
                    }
                })
            })
        })
    }
})

console.log("ssssssssss",value.transactions[4])