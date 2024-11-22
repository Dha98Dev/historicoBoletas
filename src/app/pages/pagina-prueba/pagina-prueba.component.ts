import { Component } from '@angular/core';
import * as pako from 'pako';
import { Iconos } from '../../enums/iconos.enum';
import { HistorialBoletasGetService } from '../../services/historial-boletas-get.service';
import { HistorialBoletasAgregarService } from '../../services/historial-boletas-agregar.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { userService } from '../../Autenticacion1/servicios/user-service.service';
import { opciones } from '../../componentes/componentesInputs/select-form/select-form.component';
import { concat } from 'rxjs';

@Component({
  selector: 'app-pagina-prueba',
  templateUrl: './pagina-prueba.component.html',
  styleUrl: './pagina-prueba.component.css'
})
export class PaginaPruebaComponent {
  public iconos=Iconos
  public planesEstudio: opciones[]=[];
  public ciclosEscolares: opciones[]=[];
  public contadorCambiosPlanes:number=0
  public cicloEscolar:string=''
  public planEstudioSeleccionado:string=''
  public data:any=[
    {
      "cifras": [
        {
          "CICLO": "2023-2024",
          "NIVEL": "INICIAL",
          "subnivel": "LACTANTE Y MATERNAL",
          "subcontrol": "AUTÓNOMO",
          "ALU_HOM": "0",
          "ALU_MUJ": "0",
          "ALUMNOS": "0",
          "DOC_HOM": "0",
          "DOC_MUJ": "0",
          "DOCENTES": "0",
          "GRUPOS": "0",
          "ESCUELAS": "1"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "INICIAL",
          "subnivel": "LACTANTE Y MATERNAL",
          "subcontrol": "ESTATAL",
          "ALU_HOM": "64",
          "ALU_MUJ": "79",
          "ALUMNOS": "143",
          "DOC_HOM": "0",
          "DOC_MUJ": "13",
          "DOCENTES": "13",
          "GRUPOS": "13",
          "ESCUELAS": "3"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "INICIAL",
          "subnivel": "LACTANTE Y MATERNAL",
          "subcontrol": "FEDERAL",
          "ALU_HOM": "358",
          "ALU_MUJ": "372",
          "ALUMNOS": "730",
          "DOC_HOM": "0",
          "DOC_MUJ": "14",
          "DOCENTES": "14",
          "GRUPOS": "37",
          "ESCUELAS": "10"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "INICIAL",
          "subnivel": "LACTANTE Y MATERNAL",
          "subcontrol": "FEDERAL TRANSFERIDO",
          "ALU_HOM": "145",
          "ALU_MUJ": "164",
          "ALUMNOS": "309",
          "DOC_HOM": "0",
          "DOC_MUJ": "18",
          "DOCENTES": "18",
          "GRUPOS": "20",
          "ESCUELAS": "9"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "INICIAL",
          "subnivel": "LACTANTE Y MATERNAL",
          "subcontrol": "PRIVADO",
          "ALU_HOM": "604",
          "ALU_MUJ": "636",
          "ALUMNOS": "1240",
          "DOC_HOM": "0",
          "DOC_MUJ": "30",
          "DOCENTES": "30",
          "GRUPOS": "53",
          "ESCUELAS": "14"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "INICIAL",
          "subnivel": "LACTANTE Y MATERNAL",
          "subcontrol": "SUBSIDIO",
          "ALU_HOM": "241",
          "ALU_MUJ": "208",
          "ALUMNOS": "449",
          "DOC_HOM": "0",
          "DOC_MUJ": "30",
          "DOCENTES": "30",
          "GRUPOS": "52",
          "ESCUELAS": "8"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "INICIAL",
          "subnivel": "INICIAL NO ESCOLARIZADA",
          "subcontrol": "FEDERAL TRANSFERIDO",
          "ALU_HOM": "99",
          "ALU_MUJ": "117",
          "ALUMNOS": "216",
          "DOC_HOM": "4",
          "DOC_MUJ": "10",
          "DOCENTES": "14",
          "GRUPOS": "0",
          "ESCUELAS": "15"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "INICIAL",
          "subnivel": "CCAPI",
          "subcontrol": "SUBSIDIO",
          "ALU_HOM": "205",
          "ALU_MUJ": "197",
          "ALUMNOS": "402",
          "DOC_HOM": "0",
          "DOC_MUJ": "15",
          "DOCENTES": "15",
          "GRUPOS": "0",
          "ESCUELAS": "15"
        }
      ],
      "CICLO": "2023-2024",
      "NIVEL": "EDUCACION INICIAL",
      "totales": {
        "ALU_HOM": 1716,
        "ALU_MUJ": 1773,
        "ALUMNOS": 3489,
        "DOC_HOM": 4,
        "DOC_MUJ": 130,
        "DOCENTES": 134,
        "GRUPOS": 175,
        "ESCUELAS": 75,
        "NIVEL": "EDUCACIÓN INICIAL"
      }
    },
    {
      "cifras": [
        {
          "CICLO": "2023-2024",
          "NIVEL": "PREESCOLAR",
          "subnivel": "GENERAL - 18DJN",
          "subcontrol": "FEDERAL TRANSFERIDO",
          "ALU_HOM": "14453",
          "ALU_MUJ": "14253",
          "ALUMNOS": "28706",
          "DOC_HOM": "28",
          "DOC_MUJ": "1351",
          "DOCENTES": "1379",
          "GRUPOS": "1376",
          "ESCUELAS": "474"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "PREESCOLAR",
          "subnivel": "GENERAL - 18DNM",
          "subcontrol": "FEDERAL TRANSFERIDO",
          "ALU_HOM": "110",
          "ALU_MUJ": "104",
          "ALUMNOS": "214",
          "DOC_HOM": "1",
          "DOC_MUJ": "15",
          "DOCENTES": "16",
          "GRUPOS": "16",
          "ESCUELAS": "46"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "PREESCOLAR",
          "subnivel": "GENERAL - 18EJN",
          "subcontrol": "ESTATAL",
          "ALU_HOM": "2208",
          "ALU_MUJ": "2131",
          "ALUMNOS": "4339",
          "DOC_HOM": "7",
          "DOC_MUJ": "221",
          "DOCENTES": "228",
          "GRUPOS": "228",
          "ESCUELAS": "75"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "PREESCOLAR",
          "subnivel": "GENERAL - 18NJN",
          "subcontrol": "FEDERAL",
          "ALU_HOM": "90",
          "ALU_MUJ": "92",
          "ALUMNOS": "182",
          "DOC_HOM": "0",
          "DOC_MUJ": "9",
          "DOCENTES": "9",
          "GRUPOS": "9",
          "ESCUELAS": "2"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "PREESCOLAR",
          "subnivel": "GENERAL - 18PJN",
          "subcontrol": "PRIVADO",
          "ALU_HOM": "2075",
          "ALU_MUJ": "2035",
          "ALUMNOS": "4110",
          "DOC_HOM": "4",
          "DOC_MUJ": "294",
          "DOCENTES": "298",
          "GRUPOS": "285",
          "ESCUELAS": "120"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "PREESCOLAR",
          "subnivel": "GENERAL - 18SJN",
          "subcontrol": "SUBSIDIO",
          "ALU_HOM": "393",
          "ALU_MUJ": "384",
          "ALUMNOS": "777",
          "DOC_HOM": "0",
          "DOC_MUJ": "40",
          "DOCENTES": "40",
          "GRUPOS": "40",
          "ESCUELAS": "7"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "PREESCOLAR",
          "subnivel": "GENERAL - 18UJN",
          "subcontrol": "AUTÓNOMO",
          "ALU_HOM": "0",
          "ALU_MUJ": "0",
          "ALUMNOS": "0",
          "DOC_HOM": "0",
          "DOC_MUJ": "0",
          "DOCENTES": "0",
          "GRUPOS": "0",
          "ESCUELAS": "1"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "PREESCOLAR",
          "subnivel": "INDÍGENA - 18DCC",
          "subcontrol": "FEDERAL TRANSFERIDO",
          "ALU_HOM": "2081",
          "ALU_MUJ": "1992",
          "ALUMNOS": "4073",
          "DOC_HOM": "25",
          "DOC_MUJ": "181",
          "DOCENTES": "362",
          "GRUPOS": "206",
          "ESCUELAS": "147"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "PREESCOLAR",
          "subnivel": "COMUNITARIO - 18KCC",
          "subcontrol": "FEDERAL",
          "ALU_HOM": "348",
          "ALU_MUJ": "320",
          "ALUMNOS": "668",
          "DOC_HOM": "15",
          "DOC_MUJ": "69",
          "DOCENTES": "84",
          "GRUPOS": "102",
          "ESCUELAS": "102"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "PREESCOLAR",
          "subnivel": "COMUNITARIO - 18KJN",
          "subcontrol": "FEDERAL",
          "ALU_HOM": "762",
          "ALU_MUJ": "705",
          "ALUMNOS": "1467",
          "DOC_HOM": "14",
          "DOC_MUJ": "158",
          "DOCENTES": "172",
          "GRUPOS": "220",
          "ESCUELAS": "220"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "PREESCOLAR",
          "subnivel": "COMUNITARIO - 18KNM",
          "subcontrol": "FEDERAL",
          "ALU_HOM": "6",
          "ALU_MUJ": "5",
          "ALUMNOS": "11",
          "DOC_HOM": "0",
          "DOC_MUJ": "1",
          "DOCENTES": "1",
          "GRUPOS": "1",
          "ESCUELAS": "1"
        }
      ],
      "CICLO": "2023-2024",
      "NIVEL": "PREESCOLAR",
      "totales": {
        "ALU_HOM": 22526,
        "ALU_MUJ": 22021,
        "ALUMNOS": 44547,
        "DOC_HOM": 94,
        "DOC_MUJ": 2339,
        "DOCENTES": 2589,
        "GRUPOS": 2483,
        "ESCUELAS": 1195,
        "NIVEL": "EDUCACIÓN PREESCOLAR"
      }
    },
    {
      "cifras": [
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "GENERAL",
          "subcontrol": "ESTATAL",
          "ALU_HOM": "2561",
          "ALU_MUJ": "2766",
          "ALUMNOS": "5327",
          "DOC_HOM": "178",
          "DOC_MUJ": "265",
          "DOCENTES": "443",
          "GRUPOS": "171",
          "ESCUELAS": "22"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "GENERAL",
          "subcontrol": "FEDERAL TRANSFERIDO",
          "ALU_HOM": "10283",
          "ALU_MUJ": "10152",
          "ALUMNOS": "20435",
          "DOC_HOM": "706",
          "DOC_MUJ": "946",
          "DOCENTES": "1652",
          "GRUPOS": "758",
          "ESCUELAS": "89"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "GENERAL",
          "subcontrol": "PRIVADO",
          "ALU_HOM": "2108",
          "ALU_MUJ": "2192",
          "ALUMNOS": "4300",
          "DOC_HOM": "238",
          "DOC_MUJ": "261",
          "DOCENTES": "499",
          "GRUPOS": "199",
          "ESCUELAS": "50"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "GENERAL",
          "subcontrol": "SUBSIDIO",
          "ALU_HOM": "0",
          "ALU_MUJ": "0",
          "ALUMNOS": "0",
          "DOC_HOM": "0",
          "DOC_MUJ": "0",
          "DOCENTES": "0",
          "GRUPOS": "0",
          "ESCUELAS": "1"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "TÉCNICA",
          "subcontrol": "ESTATAL",
          "ALU_HOM": "1137",
          "ALU_MUJ": "1047",
          "ALUMNOS": "2184",
          "DOC_HOM": "80",
          "DOC_MUJ": "108",
          "DOCENTES": "188",
          "GRUPOS": "77",
          "ESCUELAS": "10"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "TÉCNICA",
          "subcontrol": "FEDERAL TRANSFERIDO",
          "ALU_HOM": "9312",
          "ALU_MUJ": "9095",
          "ALUMNOS": "18407",
          "DOC_HOM": "795",
          "DOC_MUJ": "928",
          "DOCENTES": "1723",
          "GRUPOS": "651",
          "ESCUELAS": "84"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "TELESECUNDARIA",
          "subcontrol": "FEDERAL TRANSFERIDO-ESTATAL",
          "ALU_HOM": "6475",
          "ALU_MUJ": "6158",
          "ALUMNOS": "12633",
          "DOC_HOM": "396",
          "DOC_MUJ": "475",
          "DOCENTES": "871",
          "GRUPOS": "1073",
          "ESCUELAS": "297"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "COMUNITARIO",
          "subcontrol": "FEDERAL",
          "ALU_HOM": "679",
          "ALU_MUJ": "693",
          "ALUMNOS": "1372",
          "DOC_HOM": "51",
          "DOC_MUJ": "81",
          "DOCENTES": "132",
          "GRUPOS": "116",
          "ESCUELAS": "116"
        }
      ],
      "CICLO": "2023-2024",
      "NIVEL": "SECUNDARIA",
      "totales": {
        "ALU_HOM": 32555,
        "ALU_MUJ": 32103,
        "ALUMNOS": 64658,
        "DOC_HOM": 2444,
        "DOC_MUJ": 3064,
        "DOCENTES": 5508,
        "GRUPOS": 3045,
        "ESCUELAS": 669,
        "NIVEL": "EDUCACIÓN SECUNDARIA"
      }
    },
    {
      "cifras": [
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "GENERAL",
          "subcontrol": "ESTATAL",
          "ALU_HOM": "2561",
          "ALU_MUJ": "2766",
          "ALUMNOS": "5327",
          "DOC_HOM": "178",
          "DOC_MUJ": "265",
          "DOCENTES": "443",
          "GRUPOS": "171",
          "ESCUELAS": "22"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "GENERAL",
          "subcontrol": "FEDERAL TRANSFERIDO",
          "ALU_HOM": "10283",
          "ALU_MUJ": "10152",
          "ALUMNOS": "20435",
          "DOC_HOM": "706",
          "DOC_MUJ": "946",
          "DOCENTES": "1652",
          "GRUPOS": "758",
          "ESCUELAS": "89"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "GENERAL",
          "subcontrol": "PRIVADO",
          "ALU_HOM": "2108",
          "ALU_MUJ": "2192",
          "ALUMNOS": "4300",
          "DOC_HOM": "238",
          "DOC_MUJ": "261",
          "DOCENTES": "499",
          "GRUPOS": "199",
          "ESCUELAS": "50"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "GENERAL",
          "subcontrol": "SUBSIDIO",
          "ALU_HOM": "0",
          "ALU_MUJ": "0",
          "ALUMNOS": "0",
          "DOC_HOM": "0",
          "DOC_MUJ": "0",
          "DOCENTES": "0",
          "GRUPOS": "0",
          "ESCUELAS": "1"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "TÉCNICA",
          "subcontrol": "ESTATAL",
          "ALU_HOM": "1137",
          "ALU_MUJ": "1047",
          "ALUMNOS": "2184",
          "DOC_HOM": "80",
          "DOC_MUJ": "108",
          "DOCENTES": "188",
          "GRUPOS": "77",
          "ESCUELAS": "10"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "TÉCNICA",
          "subcontrol": "FEDERAL TRANSFERIDO",
          "ALU_HOM": "9312",
          "ALU_MUJ": "9095",
          "ALUMNOS": "18407",
          "DOC_HOM": "795",
          "DOC_MUJ": "928",
          "DOCENTES": "1723",
          "GRUPOS": "651",
          "ESCUELAS": "84"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "TELESECUNDARIA",
          "subcontrol": "FEDERAL TRANSFERIDO-ESTATAL",
          "ALU_HOM": "6475",
          "ALU_MUJ": "6158",
          "ALUMNOS": "12633",
          "DOC_HOM": "396",
          "DOC_MUJ": "475",
          "DOCENTES": "871",
          "GRUPOS": "1073",
          "ESCUELAS": "297"
        },
        {
          "CICLO": "2023-2024",
          "NIVEL": "SECUNDARIA",
          "subnivel": "COMUNITARIO",
          "subcontrol": "FEDERAL",
          "ALU_HOM": "679",
          "ALU_MUJ": "693",
          "ALUMNOS": "1372",
          "DOC_HOM": "51",
          "DOC_MUJ": "81",
          "DOCENTES": "132",
          "GRUPOS": "116",
          "ESCUELAS": "116"
        }
      ],
      "CICLO": "2023-2024",
      "NIVEL": "SECUNDARIA",
      "totales": {
        "ALU_HOM": 32555,
        "ALU_MUJ": 32103,
        "ALUMNOS": 64658,
        "DOC_HOM": 2444,
        "DOC_MUJ": 3064,
        "DOCENTES": 5508,
        "GRUPOS": 3045,
        "ESCUELAS": 669,
        "NIVEL": "EDUCACIÓN SECUNDARIA"
      }
    }
  ]
  constructor(private historialServiceGet: HistorialBoletasGetService, private historialServiceAdd:HistorialBoletasAgregarService, private NotificacionesService:NotificacionesService, private userService:userService){}

// Convierte un Uint8Array a Base64
uint8ArrayToBase64(uint8Array:any) {
  let binary = '';
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
  }
  const base64 = btoa(binary);
  return base64
  .replace(/\+/g, '-')  // Reemplaza '+' por '-'
  .replace(/\//g, '_')  // Reemplaza '/' por '_'
  .replace(/=+/g, '');
}

// Función para comprimir y convertir a Base64
compressData(data:any) {
  const compressedData = pako.gzip(data); // Comprime
  return this.uint8ArrayToBase64(compressedData); // Convierte a Base64
}



// Ejemplo de uso
ngOnInit() {
// Comprimiendo y convirtiendo a Base64
const dataToCompress = "ejemplo_de_cadena_base64";
const compressedData = this.compressData(JSON.stringify(this.data));
this.getCiclosEscolares()
this.getPlanesEstudio()
// console.log(compressedData); 
}

getPlanesEstudio(){
  let data={"token":this.userService.obtenerToken() }
  this.historialServiceGet.getPlanesEstudio(data).subscribe(response =>{
    if(!response.error){
    this.planesEstudio=response.data;
    // console.log(this.planesEstudio)
    this.ordernarPlanes(this.planesEstudio)
    }
  })
}

getCiclosEscolares(){
  let data={"token":this.userService.obtenerToken(), };
  this.historialServiceGet.getCiclosEscolares(data).subscribe(response=>{
    if(!response.error){
      this.ciclosEscolares=response.data;
     localStorage.setItem('ciclosEscolares', JSON.stringify(this.ciclosEscolares))
    }
  })
}

filtrarPlanEstudioByCiclo(){
  this.contadorCambiosPlanes++
  let cicloEscolar:any=this.cicloEscolar
  this.planesEstudio.forEach(plan => {
    plan.selected=false;
  })


  let cicloSeparado= cicloEscolar.split('-')
  let cicloInicio = parseInt(cicloSeparado[0])
  let cicloFin=cicloSeparado[1]
  let planesEstudio=[]

  let continuar=true
for (let i=this.planesEstudio.length -1; i>=0; i--) {
  console.log(this.planesEstudio[i].nombre)
  let nombrePlan = this.planesEstudio[i].nombre.split(' ')
  // aqui vamos a obtener el numero siguiente  a plan 
    let inicioPlan:any = nombrePlan[1]
  
    planesEstudio.push(this.planesEstudio[i])
    inicioPlan=parseInt(inicioPlan)
    if (continuar && inicioPlan <= cicloInicio) {
      this.planesEstudio[i].selected = true
      this.planEstudioSeleccionado=this.planesEstudio[i].nombre
      // this.datosGeneralesForm.patchValue({planEstudio: this.planesEstudio[i].valor})
      // this.datosGeneralesForm.controls['planEstudio'].markAsTouched()
      continuar = false;
    }
}
this.ordernarPlanes(planesEstudio)


}

ordernarPlanes(planesEstudios:opciones[]){
let planesEducIndigena:opciones[]=[]
let planesGenerales:opciones[]=[]

planesEstudios.forEach(plan =>{
  if (plan.educacion_indigena =='1') {
    planesEducIndigena.push(plan)
  }
  else{
    planesGenerales.push(plan)
  }
})

let planesOrdenados=planesEducIndigena.reverse().concat(planesGenerales.reverse())

// console.log(planesEducIndigena)
console.log(planesOrdenados)
// console.log(planesGenerales.reverse())
this.planesEstudio= planesOrdenados
}

setCiclo(ciclo:string){
  this.cicloEscolar=ciclo;
  this.filtrarPlanEstudioByCiclo()
}


}
