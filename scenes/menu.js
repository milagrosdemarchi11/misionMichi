class menu extends Phaser.Scene {
    constructor() {
        super({ key: 'menu' });
    }
    preload() {
        this.load.image("menu", "./public/assets/menunuevo.png");
        this.load.image("globomenu", "./public/assets/globomenu.png");
        this.load.image("navesopciones", "./public/assets/naveopciones.png");
    }

    create() {
        // Fondo
        const fondo = this.add.image(0, 0, 'menu').setOrigin(0, 0);
        fondo.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        const globo = this.add.image(1000, 540, 'globomenu');
        globo.setScale(4);
        this.tweens.add({
            targets: globo,
            alpha: { from: 1, to: 0.3 },
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Botón "iniciar"
        const startButton = this.add.text(
            this.cameras.main.width - 450,
            this.cameras.main.height - 480,
            'iniciar',
            {
                fontSize: '32px',
                backgroundColor: '#5353ec ',
                color: '#fff',
                padding: { x: 20, y: 10 }
            }
        ).setOrigin(0.5).setScale(1.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('juego1');
        });

        startButton.on('pointerover', () => {
            startButton.setStyle({ backgroundColor: '#555' });
        });

        startButton.on('pointerout', () => {
            startButton.setStyle({ backgroundColor: '#5353ec ' });
        });

        // Botón "Opciones"
        const botonOpciones = this.add.text(1340, 700, 'opciones', {
            fontSize: '32px',
            backgroundColor: '#5353ec ',
            color: '#fff',
            padding: { x: 10, y: 5 }
        }).setInteractive().setScale(1.5);
        botonOpciones.on('pointerover', () => {
            botonOpciones.setStyle({ backgroundColor: '#555' });
        });

        botonOpciones.on('pointerout', () => {
            botonOpciones.setStyle({ backgroundColor: '#5353ec ' });
        });

        // Centro de la cámara
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Crear rectángulo panel opciones 1500x1000 px
        const panel = this.add.rectangle(centerX, centerY, 1500, 1000, 0x000000, 0.6);
        panel.setVisible(false);

        const imagenOpciones = this.add.image(centerX, centerY, 'navesopciones');
        imagenOpciones.setScale(2.5);
        imagenOpciones.setVisible(false);

        let opcionesVisibles = false;

        // Función para cerrar opciones si clic fuera del panel
        const cerrarOpciones = (pointer) => {
            const bounds = panel.getBounds();
            if (!bounds.contains(pointer.x, pointer.y)) {
                opcionesVisibles = false;
                panel.setVisible(false);
                imagenOpciones.setVisible(false);
                this.input.off('pointerdown', cerrarOpciones);
            }
        };

        botonOpciones.on('pointerdown', () => {
            opcionesVisibles = !opcionesVisibles;
            panel.setVisible(opcionesVisibles);
            imagenOpciones.setVisible(opcionesVisibles);

            if (opcionesVisibles) {
                this.input.on('pointerdown', cerrarOpciones);
            } else {
                this.input.off('pointerdown', cerrarOpciones);
            }
        });
      
    }
}

export default menu;