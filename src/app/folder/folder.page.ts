import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Network, ConnectionStatus } from '@capacitor/network';
import { AlertController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences'
import { ApiService } from 'src/app/Api.service';
import { forEachChild } from 'typescript';



@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder!: string;
  

  constructor(private change: ChangeDetectorRef, private activatedRoute: ActivatedRoute, private alertController: AlertController, private Apiservice: ApiService) { }
  
  ngOnInit() {
    
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.getNetworkStatus();

    
    this.getAll();
    this.readData();
    //this.createData();
    //this.updateData();
   // this.deleteData();

    
  }


  public Cadastro: any = {
    Nome: "",
    Sobrenome :""
  };
  key = '';
 // valor: any;
  value: any;
  status: string = "";
  connectionType: string = "";


 
  //rede
  getNetworkStatus() {
    Network.getStatus().then(
      (status: ConnectionStatus) => {
        this.status = (status.connected) ? "connected" : "disconnected";
        this.connectionType = status.connectionType;
        this.onNetworkChanged();

      })
  }

  onNetworkChanged() {
    Network.addListener("networkStatusChange", (status) => {
      this.status = (status.connected) ? "connected" : "disconnected";
      this.connectionType = status.connectionType;
      this.change.detectChanges();
      this.presentAlert();


      if (this.status == "connected" && this.Cadastro.Nome != "") {
       
        this.createData(this.Cadastro);
      }
      this.readData();
     
    })
    
  }
   

  //storage
  async setObject(key: any) {//salva
    await Preferences.set({ key, value: JSON.stringify(this.Cadastro) });
    this.getObject(key);
  }

  async getObject(key :any) {
   
    this.value = await Preferences.get({ key });
    this.presentAlerte(this.value);
      // console.log(this.value);
  }

  
  async getAll() {
    const value = await Preferences.keys();
    console.log(value);
    //this.valor = value;
    
  }

  async RemoveObject(key:any) {
    await Preferences.remove({ key });
  }


 
  //botão
  submit() {
    
    if (this.status == "disconnected")
    {
      this.setObject(this.key);// cria no storage
     
    } else
    {
      this.createData(this.Cadastro);// criar na api
      
    }
   
  }


  //api 
  createData(data: any) {
    // recebe cadastro e faz um post para api 
      this.Apiservice.createData(data).subscribe(data => {
        console.log(data);
        this.AlerteApi(data);
      });
   
  }


  readData() {
    this.Apiservice.readData().subscribe((data: any) => {
      console.log(data);

    });
  }

  updateData() {
    const data: any = {
      Id: 1,
      Nome: "",
      Sobrenome: ""
    };

    this.Apiservice.updateData(data).subscribe(data => {
      console.log(data);
    });
  }

  deleteData() {
    this.Apiservice.deleteData().subscribe(data => {
      console.log(data);
    });
  }







  //

  async presentAlerte(data: any) {
    const alert = await this.alertController.create({
      header: 'Gravado',
      subHeader: 'Nome: ' + this.Cadastro.Nome,
      message: 'Sobrenome:' + this.Cadastro.Sobrenome,
      buttons: ['OK'],
    });

    await alert.present();
  }
  async AlerteApi(data: any) {
    const alert = await this.alertController.create({
      header: 'Gravado na Api',
      subHeader: 'Nome: ' + this.Cadastro.Nome,
      message: 'Sobrenome:' + this.Cadastro.Sobrenome,
      buttons: ['OK'],
    });

    await alert.present();
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'Rede: ' + this.status,
      message: 'Tipo:' + this.connectionType,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
