module Pong {
    export class Paddle extends Vapor.Component {
        upKey: number = Vapor.KeyCode.W;
        downKey: number = Vapor.KeyCode.S;

        AI: boolean = false;
        ball: Ball;

        topLimit: number = 3.0;
        bottomLimit = -3.0;

        boundingBox: Vapor.BoundingBox2D;
        width: number = 1.0;
        height: number = 2.0;

        halfWidth: number;
        halfHeight: number;

        public Awake() {
            this.halfWidth = this.width / 2.0;
            this.halfHeight = this.height / 2.0;
        }

        public Update() {
            this.boundingBox = new Vapor.BoundingBox2D(new Vapor.Vector2(this.transform.position.X - this.halfWidth, this.transform.position.Y - this.halfHeight),
                new Vapor.Vector2(this.transform.position.X + this.halfWidth, this.transform.position.Y + this.halfHeight));
            if (!this.AI) {
                if (Vapor.Keyboard.GetKey(this.upKey) && this.transform.position.Y + this.halfHeight < this.topLimit) {
                    // move up
                    var position = this.transform.position;
                    position.Y += 0.2;
                    this.transform.position = position;
                }

                if (Vapor.Keyboard.GetKey(this.downKey) && this.transform.position.Y - this.halfHeight > this.bottomLimit) {
                    // move down
                    var position = this.transform.position;
                    position.Y -= 0.2;
                    this.transform.position = position;
                }
            }
            else // move via AI
            {
                // only react when the ball is coming toward me (ASSUMES only right paddle is AI)
                if (this.ball.velocity.X < 0) {
                    if (this.ball.transform.position.Y < this.transform.position.Y) {
                        // move down
                        var position = this.transform.position;
                        position.Y -= 0.03;
                        this.transform.position = position;
                    }
                    else {
                        // move up
                        var position = this.transform.position;
                        position.Y += 0.03;
                        this.transform.position = position;
                    }
                }
            }
        }
    }
}