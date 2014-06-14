module Pong {
    export class Ball extends Vapor.Component {
        velocity = new Vapor.Vector3(-0.1, -0.1, 0.0);

        topLimit = 3.0;
        bottomLimit = -3.0;
        leftLimit = -5.0;
        rightLimit = 5.0;

        paddle1: Paddle;
        paddle2: Paddle;

        score1 = 0;
        score2 = 0;

        paddle1Enabled = true;

        width = 0.5;
        height = 0.5;

        //Random _random = new Random();

        audioManager: Vapor.AudioManager;
        bounceSound1: Vapor.AudioSource;
        bounceSound2: Vapor.AudioSource;
        bounceSound3: Vapor.AudioSource;

        public Awake() {
            console.log("Awake");
            this.audioManager = new Vapor.AudioManager();
            Vapor.AudioSource.FromFile(this.audioManager, "Sounds/Blip_Select.wav", (source) => { this.bounceSound1 = source; });
            Vapor.AudioSource.FromFile(this.audioManager, "Sounds/Blip_Select2.wav", (source) => { this.bounceSound2 = source; });
            Vapor.AudioSource.FromFile(this.audioManager, "Sounds/Blip_Select3.wav", (source) => { this.bounceSound3 = source; });
        }

        //public Start() {
        //    console.log("Start");
        //    this.audioManager = new Vapor.AudioManager();
        //    Vapor.AudioSource.FromFile(this.audioManager, "Sounds/Blip_Select.wav", (source) => { console.log("sound loaded"); this.bounceSound1 = source; this.bounceSound1.Play(); });
        //}

        public Update() {
            var position = this.transform.position;
            position.Add(this.velocity);
            this.transform.position = position;
            
            if (this.transform.position.X < this.leftLimit) {
                //window.console.log("Player 2 Scored!");
                this.score1++;
                var score1 = document.getElementById("score1");
                score1.textContent = this.score1.toString();
                this.velocity.X = -this.velocity.X;
                this.transform.position = new Vapor.Vector3(0.0, 0.0, 0.0);
                //this.velocity.y = _random.nextDouble() * 0.1;

                this.paddle1Enabled = true;
            }
            else if (this.transform.position.X > this.rightLimit) {
                //window.console.log("Player 1 Scored!");
                this.score2++;
                var score2 = document.getElementById("score2");
                score2.textContent = this.score2.toString();
                this.velocity.X = -this.velocity.X;
                this.transform.position = new Vapor.Vector3(0.0, 0.0, 0.0);
                //this.velocity.y = _random.nextDouble() * 0.1;

                this.paddle1Enabled = false;
            }

            var halfWidth = this.width / 2.0;
            var halfHeight = this.height / 2.0;
            var boundingBox = new Vapor.BoundingBox2D(new Vapor.Vector2(this.transform.position.X - halfWidth, this.transform.position.Y - halfHeight), new Vapor.Vector2(this.transform.position.X + halfWidth, this.transform.position.Y + halfHeight));

            if (this.transform.position.Y - halfHeight <= this.bottomLimit || this.transform.position.Y + halfHeight >= this.topLimit) {
                this.velocity.Y = -this.velocity.Y;
                this.bounceSound1.Play();
            }

            // check collision with the paddles
            var errorMargin = 0.1;
            if (this.paddle1Enabled && boundingBox.IntersectsBoundingBox(this.paddle1.boundingBox)) {
                // if the ball is beyond the right most edge of the paddle
                if (this.transform.position.X <= this.paddle1.transform.position.X + this.paddle1.halfWidth - errorMargin) {
                    this.velocity.Y = -this.velocity.Y;
                }

                // always reverse the horizontal direction
                this.velocity.X = -this.velocity.X;

                this.paddle1Enabled = false;

                this.bounceSound2.Play();
            }
            else if (!this.paddle1Enabled && boundingBox.IntersectsBoundingBox(this.paddle2.boundingBox)) {
                // if the ball is beyond the left most edge of the paddle
                if (this.transform.position.X >= this.paddle2.transform.position.X - this.paddle2.halfWidth + errorMargin) {
                    this.velocity.Y = -this.velocity.Y;
                }

                // always reverse the horizontal direction
                this.velocity.X = -this.velocity.X;

                this.paddle1Enabled = true;

                this.bounceSound3.Play();
            }
        }
    }
}