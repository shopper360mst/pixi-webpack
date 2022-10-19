import * as PIXI from 'pixi.js'
import {PixiInspector} from "pixi-inspector";
import { Viewport } from './vendor/viewport.min';

export default class Main {
  constructor() {
     this.app = new PIXI.Application({
      autoResize: true,
      backgroundColor: 0x000000,
      view: document.querySelector('#scene'),
      resolution: window.devicePixelRatio || 1
    }); 
    this.viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 1200,
      worldHeight: 1040,
      passiveWheel: false,
      interaction: this.app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    this.inspector =  new PixiInspector(this.app.stage, this.app.renderer);
    this.resize();
    
    this.spriteText = new PIXI.Text('Loading...',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
    this.spriteText.x = (this._innerWidth / 2) - this.spriteText.width / 2;
    this.spriteText.y = (this._innerHeight / 2) - this.spriteText.height / 2;

    this.app.stage.addChild(this.viewport);
    this.app.stage.addChild(this.spriteText);
    // activate plugins
    this.viewport
    .drag()
    .pinch()
    .wheel()
    .decelerate();

    this.viewport.fit();
    this.viewport.moveCenter(window.innerWidth / 2,  window.innerHeight / 2);
    this.viewport.clamp({
        left: false,                // whether to clamp to the left and at what value
        right: false,               // whether to clamp to the right and at what value
        top: false,                 // whether to clamp to the top and at what value
        bottom: false,              // whether to clamp to the bottom and at what value
        direction: 'all',           // (all, x, or y) using clamps of [0, viewport.worldWidth / viewport.worldHeight]; replaces left / right / top / bottom if set
        underflow: 'center',	       // where to place world if too small for screen (e.g., top - right, center, none, bottomleft)
    });

    this.viewport.clampZoom({
        minWidth: null,                 // minimum width
        minHeight: null,                // minimum height
        maxWidth: 1000,                 // maximum width
        maxHeight: 1040,                // maximum height
        minScale: null,                 // minimum scale
        maxScale: null,                 // minimum scale
    });

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

    const map = this.viewport.addChild(new PIXI.Sprite( this.app.loader.resources.pngMap.texture ));
    const bunny = this.viewport.addChild(new PIXI.Sprite( this.app.loader.resources.pngBunny.texture ));
    // const line = this.viewport.addChild(new PIXI.Graphics());
    // line.lineStyle(10, 0xff0000).drawRect(0, 0, this.viewport.worldWidth, this.viewport.worldHeight);
    bunny.anchor.set(0.5);
    bunny.scale.set(0.5);
    bunny.x = this.viewport.worldWidth / 2;
    bunny.y = this.viewport.worldHeight / 2;
    map.anchor.set(0.5);
    map.x = this.viewport.worldWidth / 2;
    map.y = this.viewport.worldHeight / 2;
    // this.app.stage.addChild(map);
  }
  resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);    
    this._innerHeight = window.innerHeight;
    this._innerWidth  = window.innerWidth;    
  }
};

const pg = new Main();