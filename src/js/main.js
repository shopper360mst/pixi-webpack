import * as PIXI from 'pixi.js'
import {PixiInspector} from "pixi-inspector";

export default class Main {
  constructor() {
     this.app = new PIXI.Application({
      autoResize: true,
      backgroundColor: 0x000000,
      view: document.querySelector('#scene'),
      resolution: window.devicePixelRatio || 1
    }); 
    this.inspector =  new PixiInspector(this.app.stage, this.app.renderer);
    this.resize();
    
    this.spriteText = new PIXI.Text('Loading...',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
    this.spriteText.x = (this._innerWidth / 2) - this.spriteText.width / 2;
    this.spriteText.y = (this._innerHeight / 2) - this.spriteText.height / 2;

    this.app.stage.addChild(this.spriteText);
    this.loadAssets();
    
  }
  async loadAssets() {
    
    this.app.loader.baseUrl = "assets";
    this.app.loader
      .add('preloader', 'loading.png')
      .add('pngBunny', 'bunny.png')
      .add('pngMap', 'map.png')
      .add('bgLoop', 'sound/ambience_day.mp3');
 
    this.app.loader.onProgress.add((evt) => {
      this.spriteText.text = "Loading... "+evt.progress+"%";
    });
    this.app.loader.onComplete.add(() => {
      this.spriteText.visible = false;
      this.loadScene();
    });
    this.app.loader.onError.add(this.showError);
    this.app.loader.load();
  }
  showError() {
    console.log("Oops...There is an error in loading...");
  }
  loadScene() {

    const map = new PIXI.Sprite( this.app.loader.resources.pngMap.texture );

    map.anchor.set(0.5);
    map.x = this._innerWidth / 2;
    map.y = this._innerHeight / 2;
    this.app.stage.addChild(map);
  }
  resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);    
    this._innerHeight = window.innerHeight;
    this._innerWidth  = window.innerWidth;    
  }
};

const pg = new Main();