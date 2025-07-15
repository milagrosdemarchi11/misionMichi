export default class juego3 extends Phaser.Scene {
  constructor() {
    super("juego3");
  }

  init() {
    console.log("Inicializando la escena");
  }

  preload() {
    this.load.image("enemigo1", "./public/assets/asteroide1.png");
    this.load.image("universo", "./public/assets/fondouniverso.png");
    this.load.image("enemigo2", "./public/assets/asteroide2.png");
    this.load.image("enemigo3", "./public/assets/asteroide3.png");
    this.load.spritesheet("pocho", "./public/assets/personaje-Sheet.png", {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.image("laser", "./public/assets/laser.png");
    this.load.image("explosion", "./public/assets/explosion.png");
    this.load.image("hasperdido", "./public/assets/hasperdido.png");
    this.load.image("botonsiguiente", "./public/assets/botonpasadeescena.png");
    this.load.image("tiempoterminado", "./public/assets/tiempoterminado.png");
    this.load.image("scoreimg", "./public/assets/scoreimg.png");
    this.load.image("tiempo", "./public/assets/reloj.png");
    this.load.image("juntadelasers", "./public/assets/power.png");
    this.load.image("croquetas", "./public/assets/croquetas.png");
    this.load.image("naveajustes", "./public/assets/naveajustes")
   
    this.load.audio("laseraudio", './public/assets/lasertp.wav');
    this.load.audio("explosionsonido", './public/assets/explosiontp.wav');
  }

  create() {
    this.explosionSound = this.sound.add('explosionsonido');
    this.laserSound = this.sound.add('laseraudio');
    this.input.keyboard.on('keydown-J', () => {
      this.laserSound.play();
    });



    this.finalizado = false;
    this.stop = false;


    this.estaGolpeando = false;

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.image(width / 2, height / 2, "universo")

    this.enemigos = this.physics.add.group();
    this.powers = this.physics.add.group();
    this.croquetasGroup = this.physics.add.group();

     this.enemigos = this.physics.add.group();
    this.powers = this.physics.add.group();
    this.croquetasGroup = this.physics.add.group();

   this.eventoEnemigo1 = this.time.addEvent({
  delay: 2000,
  callback: () => {
    if (!this.stop) {
      let x = Phaser.Math.Between(100, this.sys.game.config.width - 100);
      let enemigo = this.enemigos.create(x, -50, "enemigo1");
      enemigo.setScale(4);
      enemigo.setVelocityY(Phaser.Math.Between(150, 250));
    }
  },
  callbackScope: this,
  loop: true
});

  this.eventoEnemigo2 = this.time.addEvent({
  delay: 1000,
  callback: () => {
    if (!this.stop) {
      let x = Phaser.Math.Between(100, this.sys.game.config.width - 100);
      let enemigo = this.enemigos.create(x, -50, "enemigo2");
      enemigo.setScale(4);
      enemigo.setVelocityY(Phaser.Math.Between(150, 250));
    }
  },
  callbackScope: this,
  loop: true
});
    this.eventoEnemigo3 = this.time.addEvent({
  delay: 800,
  callback: () => {
    if (!this.stop) {
      let x = Phaser.Math.Between(100, this.sys.game.config.width - 100);
      let enemigo = this.enemigos.create(x, -50, "enemigo3");
      enemigo.setScale(4);
      enemigo.setVelocityY(Phaser.Math.Between(150, 250));
    }
  },
  callbackScope: this,
  loop: true
});

   this.time.addEvent({
  delay: 8000,
  callback: () => {
    if (this.stop) return; //  no crear croquetas si el juego está detenido
    let x = Phaser.Math.Between(100, this.sys.game.config.width - 100);
    let croqueta = this.croquetasGroup.create(x, -30, "croquetas");
    croqueta.setVelocityY(100);
    croqueta.setScale(2.5);
  },
  callbackScope: this,
  loop: true
});

    this.personaje = this.physics.add.sprite(width / 2, height - 110, "pocho");
    this.personaje.body.allowGravity = false;
    this.personaje.setScale(3.5);
    this.personaje.setCollideWorldBounds(true);
    this.personaje.setFrame(1);

    this.anims.create({ key: "golpeado", frames: [{ key: "pocho", frame: 9 }, { key: "pocho", frame: 10 }], frameRate: 6, repeat: 0 });
    this.anims.create({ key: "golpe_melee", frames: this.anims.generateFrameNumbers("pocho", { start: 6, end: 8 }), frameRate: 60, repeat: 0 });

    this.teclaA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.teclaD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.teclaJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);

    this.lasers = this.physics.add.group();
    this.ultimoDisparo = 0;
    this.tiempoEntreDisparos = 600;

    this.cargasLaser = 4;
    this.textoCargas = this.add.text(30, 140, "Cargas: 4", { fontSize: "36px", fill: "#ffffff", fontFamily: "times new roman" });

    this.fuerza = 0;
    this.textoFuerza = this.add.text(30, 190, "Croquetas: 0", {
      fontSize: "36px",
      fill: "#ffffff",
      fontFamily: "times new roman"
    });


    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(this.lasers, this.enemigos, this.laserContraEnemigo, null, this);
    this.physics.add.overlap(this.personaje, this.enemigos, this.colisionPersonajeEnemigo, null, this);
    this.physics.add.overlap(this.personaje, this.powers, this.recogerPower, null, this);
    this.physics.add.overlap(this.personaje, this.croquetasGroup, this.recogerCroqueta, null, this);

    const scoreImg = this.add.image(-15, 40, "scoreimg").setOrigin(0, 0.5).setScale(2.5);
    this.registry.get('puntaje');
    this.textoPuntaje = this.add.text(scoreImg.x + scoreImg.displayWidth + 10, scoreImg.y, this.registry.get('puntaje'), { fontSize: "48px", fill: "#fff", fontFamily: "times new roman" }).setOrigin(0, 0.5);

    this.tiempoGlobal = this.registry.get('tiempoGlobal') || 60; // Empieza desde 60

    const iconoTiempo = this.add.image(12, 90, "tiempo").setOrigin(0, 0.5).setScale(0.9);
    this.textoTemporizador = this.add.text(iconoTiempo.x + iconoTiempo.displayWidth + 10, iconoTiempo.y, this.tiempoGlobal, { fontSize: "48px", fill: "#fff", fontFamily: "times new roman" }).setOrigin(0, 0.5);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.tiempoGlobal++;
        this.textoTemporizador.setText(this.tiempoGlobal);
        // No hay límite de tiempo en esta escena, se termina al perder
      },
      callbackScope: this,
      loop: true
    });

  }

  update(time) {
    if (this.stop) return;
    const velocidad = 300;
    if (this.teclaA.isDown) {
      this.personaje.setVelocityX(-velocidad);
      this.personaje.setFrame(2);
    } else if (this.teclaD.isDown) {
      this.personaje.setVelocityX(velocidad);
      this.personaje.setFrame(1);
    } else {
      this.personaje.setVelocityX(0);
    }

    if (Phaser.Input.Keyboard.JustDown(this.teclaJ) && time > this.ultimoDisparo + this.tiempoEntreDisparos) {
      this.ultimoDisparo = time;
      if (this.cargasLaser > 0) {
        this.dispararLaser();
      } else {
        this.realizarGolpe();
      }
    }
  }

  dispararLaser() {
    const laser = this.lasers.create(this.personaje.x, this.personaje.y - 30, "laser");
    laser.setVelocityY(-600);
    laser.body.allowGravity = false;
    laser.setScale(4);
    laser.setDepth(1);
    this.cargasLaser--;
    this.textoCargas.setText("Cargas: " + this.cargasLaser);
    if (this.cargasLaser === 0) {
      this.textoCargas.setFill("#ff0000");
      this.tweens.add({ targets: this.textoCargas, alpha: 0, duration: 300, ease: "Linear", yoyo: true, repeat: -1 });
    }
  }
  realizarGolpe() {
    console.log("Golpe realizado");
    this.personaje.once("animationcomplete-golpe_melee", () => {
      this.estaGolpeando = false;
      this.personaje.setFrame(1); // volver al frame neutro
    });

    this.personaje.setVelocityX(0);
    this.personaje.play("golpe_melee", true);
    this.estaGolpeando = true;


    //  Permitir golpear más rápido: no esperar a que termine la animación
    this.time.delayedCall(200, () => {
      this.estaGolpeando = false;
    });

    const radioDeGolpe = 180;

    this.enemigos.getChildren().forEach((enemigo) => {
      const distancia = Phaser.Math.Distance.Between(this.personaje.x, this.personaje.y, enemigo.x, enemigo.y);
      if (distancia <= radioDeGolpe && this.fuerza > 0) {
        this.fuerza--;
        this.textoFuerza.setText("Croquetas: " + this.fuerza);
       

 
        const explosion = this.add.image(enemigo.x, enemigo.y, "explosion").setScale(0.2);
        this.time.delayedCall(300, () => explosion.destroy());
        enemigo.disableBody(true, true);
           this.explosionSound.play(); 
        if (Phaser.Math.Between(0, 1) === 1) {
          const power = this.powers.create(enemigo.x, enemigo.y, "juntadelasers").setScale(2.5);
          power.setVelocityY(100);
        }
      }
    });
    console.log("GOLPEANDO " + this.estaGolpeando);
    console.log("FUERZA " + this.fuerza);
  }



  recogerPower(personaje, power) {
    power.destroy();
    this.recuperarCargas();
  }


  recogerCroqueta(personaje, croqueta) {
    croqueta.destroy();
    this.fuerza = 5;
    this.textoFuerza.setText("Croquetas: " + this.fuerza);
  }



  recuperarCargas() {
    this.cargasLaser = 4;
    this.textoCargas.setText("Cargas: " + this.cargasLaser);
    this.textoCargas.setFill("#ffffff");
    this.tweens.killTweensOf(this.textoCargas);
    this.textoCargas.setAlpha(1);
  }

  laserContraEnemigo(laser, enemigo) {
    const explosion = this.add.image(enemigo.x, enemigo.y, "explosion");
    explosion.setScale(0.2);
    this.explosionSound.play(); 
    laser.destroy();
    enemigo.disableBody(true, true);
    let puntos = this.registry.get('puntaje');
    puntos += 10;
    this.registry.set('puntaje', puntos);
    this.textoPuntaje.setText(this.registry.get('puntaje'));

    if (Phaser.Math.Between(0, 1) === 1) {
      const power = this.powers.create(enemigo.x, enemigo.y, "juntadelasers").setScale(2.5);
      power.setVelocityY(100);
    }
    this.time.delayedCall(300, () => explosion.destroy());
  }

  colisionPersonajeEnemigo = (personaje, enemigo) => {
    // Si está golpeando y tiene fuerza, DESTRUIR al enemigo, no morir
    console.log("TESTEO ESTA GOLPEANDO " + this.estaGolpeando + " CARGAS LASER " + this.cargasLaser + " FUERZA " + this.fuerza);
    if (this.cargasLaser === 0 && this.fuerza > 0) {
      console.log("Golpe exitoso, enemigo destruido");
      this.fuerza--;
      this.textoFuerza.setText("Croquetas: " + this.fuerza);

      const explosion = this.add.image(enemigo.x, enemigo.y, "explosion").setScale(0.2);
      enemigo.disableBody(true, true);

      if (Phaser.Math.Between(0, 1) === 1) {
        const power = this.powers.create(enemigo.x, enemigo.y, "juntadelasers").setScale(2.5);
        power.setVelocityY(100);
      }

      this.time.delayedCall(300, () => explosion.destroy());

      // Asegurar que el personaje no sea empujado
      personaje.setVelocity(0, 0);
      personaje.body.allowGravity = false;

      return;

    } else if (this.cargasLaser >= 0 && this.fuerza >= 0) {
      console.log("Golpe fallido, personaje golpeado");
      this.physics.world.pause();

      this.stop = true; // Evitar que se sigan procesando eventos de colisión
      //  Solo se llega aquí si NO estaba golpeando o no tenía fuerza → morir
      personaje.setVelocity(0, 0);
      personaje.body.allowGravity = false;
      personaje.body.immovable = true;

      // Evitar repetir animación o estado
      if (!this.finalizado) {
        this.finalizado = true;

        personaje.setTint(0xff0000);
        personaje.play("golpeado", true);

        //detiene el temporizador
        //this.timerEvent.remove(false);


        personaje.once("animationcomplete-golpeado", () => {
          this.physics.pause();

          const img = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "hasperdido").setOrigin(0.5);
          img.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

          const puntajeFinal = this.registry.get("puntaje") || 0;

          // Coordenadas ajustadas para que aparezca alineado al "SCORE=" de la imagen
          this.add.text(this.cameras.main.centerX - 70, this.cameras.main.centerY + 90, puntajeFinal, {
            fontSize: "100px",
            fill: "#000",
            fontFamily: "pixelify sans",
            fontStyle: "bold"
          }).setOrigin(0, 0.5);

          this.time.delayedCall(3500, () => {
            this.scene.start("menu");
          });
        });
      }
    };
  }
}