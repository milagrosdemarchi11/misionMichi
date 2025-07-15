// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/
export default class juego1 extends Phaser.Scene {
  constructor() {
    super("juego1");
 }

// preload()
  preload() {
    this.load.image("enemigo1", "./public/assets/asteroide1.png");
    this.load.image("cielo", "./public/assets/fondomundo.png");
    this.load.image("enemigo2", "./public/assets/asteroide2.png");
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
    this.load.image("menupausa", "./public/assets/naveajustes.png");
    this.load.audio("musica", "./public/assets/musicatpp.mp3");
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
    this.registry.set('puntaje', 0);
    this.registry.set('sonido', 0.5);
    this.pause = false;
    // Música global, solo una vez
    if (!this.sys.game.musicaFondo) {
      this.sys.game.musicaFondo = this.sound.add('musica', {
        loop: true,
        volume: this.registry.get('sonido') / 0.5
      });
      this.sys.game.musicaFondo.play();
    }
    this.musica = this.sys.game.musicaFondo;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.image(width / 2, height / 2, "cielo");

    this.enemigos = this.physics.add.group();

    // Guarda la referencia del evento de spawn de enemigo1
    this.spawnEnemigo1 = this.time.addEvent({
      delay: 3000,
      callback: () => {
        let margen = 64;
        const scale = 4;
        const totalMargen = margen * scale;
        let x = Phaser.Math.Between(
          totalMargen,
          this.sys.game.config.width - totalMargen
        );
        let enemigo = this.enemigos.create(x, -50, "enemigo1");
        enemigo.setScale(scale);
        enemigo.setVelocityY(Phaser.Math.Between(150, 250));
      },
      callbackScope: this,
      loop: true,
    });

    // Guarda la referencia del evento de spawn de enemigo2
    this.spawnEnemigo2 = this.time.addEvent({
      delay: 6000,
      callback: () => {
        let margen = 64;
        const scale = 4;
        let totalMargen = margen * scale;
        let x = Phaser.Math.Between(
          totalMargen,
          this.sys.game.config.width - totalMargen
        );
        let enemigo = this.enemigos.create(x, -50, "enemigo2");
        enemigo.setScale(scale);
        enemigo.setVelocityY(Phaser.Math.Between(170, 270));
      },
      callbackScope: this,
      loop: true,
    });

    this.personaje = this.physics.add.sprite(width / 2, height - 110, "pocho");
    this.personaje.body.allowGravity = false;
    this.personaje.setScale(3.5);
    this.personaje.setCollideWorldBounds(true);
    this.personaje.setFrame(1); // Por defecto mirando a la derecha

    // Animación de golpeado para cuando muere
    this.anims.create({
      key: "golpeado",
      frames: [
        { key: "pocho", frame: 9 },
        { key: "pocho", frame: 10 }
      ],
      frameRate: 6,
      repeat: 0
    });

    this.teclaA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.teclaD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.teclaJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.escape = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.volumeUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT);
    this.volumeDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

    this.lasers = this.physics.add.group();

    this.ultimoDisparo = 0;
    this.tiempoEntreDisparos = 600;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(
      this.lasers,
      this.enemigos,
      this.laserContraEnemigo,
      null,
      this
    );

    this.physics.add.collider(
      this.personaje,
      this.enemigos,
      this.colisionPersonajeEnemigo,
      null,
      this
    );

    const scoreImg = this.add
      .image(-15, 40, "scoreimg")
      .setOrigin(0, 0.5)
      .setScale(2.5);

    this.puntaje = this.registry.get('puntaje'); // Obtener el puntaje del registro
    this.textoPuntaje = this.add
      .text(scoreImg.x + scoreImg.displayWidth + 10, scoreImg.y, this.puntaje, {
        fontSize: "48px",
        fill: "#fff",
        fontFamily: "times new roman",
      })
      .setOrigin(0, 0.5);


    // Agregar el ícono del tiempo
    // Agregar el ícono del tiempo (nombre correcto: "tiempo")
    this.tiempoRestante = 0; // o el tiempo que quieras mostrar en segundos

    const iconoTiempo = this.add.image(12, 90, "tiempo")
      .setOrigin(0, 0.5)
      .setScale(0.9); // Ajustá el tamaño si es necesario


    // Solo mostrar el número del tiempo
    this.textoTemporizador = this.add.text(
      iconoTiempo.x + iconoTiempo.displayWidth + 10,
      iconoTiempo.y,
      this.tiempoRestante,
      {
        fontSize: "48px",
        fill: "#fff",
        fontFamily: "times new roman",
      }
    ).setOrigin(0, 0.5);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.tiempoRestante++;

        if (this.tiempoRestante >= 0) {
          this.textoTemporizador.setText(this.tiempoRestante);
        }

        if (this.tiempoRestante === 20 && !this.finalizado) {
          this.finalizado = true; // Prevenir duplicación
          this.physics.world.pause();
          

          const fondo = this.add.rectangle(
            0,
            0,
            this.sys.game.config.width,
            this.sys.game.config.height,
            0x000000,
            0.7
          );
          fondo.setOrigin(0, 0);

          // Imagen a pantalla completa
          const cartelTiempo = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "tiempoterminado"
          ).setOrigin(0.5);

          // Escalado para cubrir la pantalla
          const scaleX = this.sys.game.config.width / cartelTiempo.width;
          const scaleY = this.sys.game.config.height / cartelTiempo.height;
          const scale = Math.max(scaleX, scaleY); // usa MAX si querés que se cubra toda la pantalla aunque se recorte
          cartelTiempo.setScale(scale).setDepth(10);

          // Mostrar el puntaje sobre la imagen de "tiempo terminado"
          this.add.text(
            this.cameras.main.centerX - 70,
            this.cameras.main.centerY + 90,
            this.registry.get('puntaje'),
            {
              fontSize: "120px",
              fill: "#000",
              fontFamily: "pixelify sans",
              fontStyle: "bold"
            }
          ).setOrigin(0.5).setDepth(11);

          // Botón siguiente
          const botonSiguiente = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 280,
            "botonsiguiente"
          );
          botonSiguiente.setInteractive({ useHandCursor: true });
          botonSiguiente.setScale(2.8);
          botonSiguiente.setDepth(12); // ¡Esto asegura que esté adelante!

          botonSiguiente.on("pointerdown", () => {
            this.scene.start("juego2")
          });
        }

      },
      callbackScope: this,
      repeat: 19,
    });

  }

  update(time, delta) {
    if (!this.pause) {
      const velocidad = 300;

      if (this.teclaA.isDown) {
        this.personaje.setVelocityX(-velocidad);
        this.personaje.setFrame(2); // frame para moverse a la izquierda
      } else if (this.teclaD.isDown) {
        this.personaje.setVelocityX(velocidad);
        this.personaje.setFrame(1); // frame para moverse a la derecha
      } else {
        this.personaje.setVelocityX(0);
      }

      if (
        Phaser.Input.Keyboard.JustDown(this.teclaJ) &&
        time > this.ultimoDisparo + this.tiempoEntreDisparos
      ) {
        this.dispararLaser();
        this.ultimoDisparo = time;
      }
    }

    // Manejo de pausa
    if (Phaser.Input.Keyboard.JustDown(this.escape)) {
      console.log("Escape presionado");
      this.togglePause();
    }

    // Manejo de volumen
    if (this.pause && Phaser.Input.Keyboard.JustDown(this.volumeUp)) {
      let volumen = this.registry.get('sonido');
      volumen = Math.min(volumen + 1, 10); // Aumenta el volumen hasta un máximo de 10
      this.registry.set('sonido', volumen);
      if (this.musica) this.musica.setVolume(volumen / 10)
      console.log("Volumen aumentado a:", volumen);
    } else if (this.pause && Phaser.Input.Keyboard.JustDown(this.volumeDown)) {
      let volumen = this.registry.get('sonido');
      volumen = Math.max(volumen - 1, 0); // Disminuye el volumen hasta un mínimo de 0
      this.registry.set('sonido', volumen);
      if (this.musica) this.musica.setVolume(volumen / 10)
      console.log("Volumen disminuido a:", volumen);
    }
  }

  togglePause() {
    this.pause = !this.pause;
    console.log("Pausa:", this.pause);

    if (this.pause) {
      this.physics.pause();
      if (this.timerEvent) this.timerEvent.paused = true;
      if (this.spawnEnemigo1) this.spawnEnemigo1.paused = true;
      if (this.spawnEnemigo2) this.spawnEnemigo2.paused = true;

      this.menuPausaImg = this.add.image(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "menupausa"

      ).setOrigin(0.5);
      this.menuPausaImg.setScale(2)
    } else {
      this.physics.resume();
      if (this.timerEvent) this.timerEvent.paused = false;
      if (this.spawnEnemigo1) this.spawnEnemigo1.paused = false;
      if (this.spawnEnemigo2) this.spawnEnemigo2.paused = false;

      this.menuPausaImg.destroy();
      this.menuPausaImg = null;
    }
  }

  dispararLaser() {
    const laser = this.lasers.create(
      this.personaje.x,
      this.personaje.y - 30,
      "laser"
    );
    laser.setVelocityY(-600);
    laser.body.allowGravity = false;
    laser.setScale(4);
    laser.setDepth(1);
  }

  laserContraEnemigo(laser, enemigo) {
    const explosion = this.add.image(enemigo.x, enemigo.y, "explosion");
    explosion.setScale(0.2);
    this.explosionSound.play(); // Sonido justo cuando explota



    laser.destroy();
    enemigo.destroy();

    //this.puntaje += 10;
    //this.textoPuntaje.setText(this.puntaje);
    let puntos = this.registry.get('puntaje');
    puntos += 10;
    this.registry.set('puntaje', puntos);
    this.textoPuntaje.setText(this.registry.get('puntaje'));

    this.time.delayedCall(300, () => {
      explosion.destroy();
    });
  }

  colisionPersonajeEnemigo = (personaje, enemigo) => {
    personaje.setVelocity(0);
    personaje.setTint(0xff0000);
    personaje.setFrame(9);
    personaje.anims.play("golpeado");

    this.enemigos.clear(true, true);

    // Nueva forma de esperar: simple retraso
    this.time.delayedCall(500, () => {
      this.physics.pause();

      const img = this.add.image(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "hasperdido"
      ).setOrigin(0.5);

      img.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

      const scoreX = this.cameras.main.centerX - 60 + 230;
      const scoreY = this.cameras.main.centerY + 90;

      this.add.text(scoreX, scoreY, this.puntaje, {
        fontSize: "120px",
        fill: "#000",
        fontFamily: "pixelify sans",
        fontStyle: "bold"
      }).setOrigin(0, 0.5);

      this.time.delayedCall(3500, () => {
        this.scene.start('menu');
      });
    });
  };
}