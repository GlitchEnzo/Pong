var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Pong;
(function (Pong) {
    var Ball = (function (_super) {
        __extends(Ball, _super);
        function Ball() {
            _super.apply(this, arguments);
            this.velocity = new Vapor.Vector3(-0.1, -0.1, 0.0);
            this.topLimit = 3.0;
            this.bottomLimit = -3.0;
            this.leftLimit = -5.0;
            this.rightLimit = 5.0;
            this.score1 = 0;
            this.score2 = 0;
            this.paddle1Enabled = true;
            this.width = 0.5;
            this.height = 0.5;
        }
        //Random _random = new Random();
        Ball.prototype.Update = function () {
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
            } else if (this.transform.position.X > this.rightLimit) {
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
            } else if (!this.paddle1Enabled && boundingBox.IntersectsBoundingBox(this.paddle2.boundingBox)) {
                // if the ball is beyond the left most edge of the paddle
                if (this.transform.position.X >= this.paddle2.transform.position.X - this.paddle2.halfWidth + errorMargin) {
                    this.velocity.Y = -this.velocity.Y;
                }

                // always reverse the horizontal direction
                this.velocity.X = -this.velocity.X;

                this.paddle1Enabled = true;
            }
        };
        return Ball;
    })(Vapor.Component);
    Pong.Ball = Ball;
})(Pong || (Pong = {}));
var Pong;
(function (Pong) {
    var Paddle = (function (_super) {
        __extends(Paddle, _super);
        function Paddle() {
            _super.apply(this, arguments);
            this.upKey = 87 /* W */;
            this.downKey = 83 /* S */;
            this.AI = false;
            this.topLimit = 3.0;
            this.bottomLimit = -3.0;
            this.width = 1.0;
            this.height = 2.0;
        }
        Paddle.prototype.Awake = function () {
            this.halfWidth = this.width / 2.0;
            this.halfHeight = this.height / 2.0;
        };

        Paddle.prototype.Update = function () {
            this.boundingBox = new Vapor.BoundingBox2D(new Vapor.Vector2(this.transform.position.X - this.halfWidth, this.transform.position.Y - this.halfHeight), new Vapor.Vector2(this.transform.position.X + this.halfWidth, this.transform.position.Y + this.halfHeight));
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
            } else {
                // only react when the ball is coming toward me (ASSUMES only right paddle is AI)
                if (this.ball.velocity.X < 0) {
                    if (this.ball.transform.position.Y < this.transform.position.Y) {
                        // move down
                        var position = this.transform.position;
                        position.Y -= 0.03;
                        this.transform.position = position;
                    } else {
                        // move up
                        var position = this.transform.position;
                        position.Y += 0.03;
                        this.transform.position = position;
                    }
                }
            }
        };
        return Paddle;
    })(Vapor.Component);
    Pong.Paddle = Paddle;
})(Pong || (Pong = {}));
window.onload = function () {
    var scene = new Vapor.Scene();

    var shader = Vapor.Shader.FromFile("../shaders/white.glsl");
    var material = new Vapor.Material(shader);

    var camera = Vapor.GameObject.CreateCamera();
    camera.transform.position = new Vapor.Vector3(0.0, 0.0, -7.0);
    scene.AddGameObject(camera);

    var paddle1 = Vapor.GameObject.CreateQuad();
    paddle1.transform.Scale = new Vapor.Vector3(1.0, 2.0, 1.0);
    var paddle1Comp = new Pong.Paddle();
    paddle1.AddComponent(paddle1Comp);
    paddle1.renderer.material = material;
    paddle1.transform.position = new Vapor.Vector3(3.5, 0.0, 0.0);
    scene.AddGameObject(paddle1);

    var paddle2 = Vapor.GameObject.CreateQuad();
    paddle2.transform.Scale = new Vapor.Vector3(1.0, 2.0, 1.0);
    var paddle2Comp = new Pong.Paddle();
    paddle2Comp.AI = true;
    paddle2.AddComponent(paddle2Comp);
    paddle2.renderer.material = material;
    paddle2.transform.position = new Vapor.Vector3(-3.5, 0.0, 0.0);
    scene.AddGameObject(paddle2);

    var ball = Vapor.GameObject.CreateQuad();
    ball.transform.Scale = new Vapor.Vector3(0.5, 0.5, 1.0);
    var ballComp = new Pong.Ball();
    ballComp.paddle1 = paddle1Comp;
    ballComp.paddle2 = paddle2Comp;
    ball.AddComponent(ballComp);
    ball.renderer.material = material;
    scene.AddGameObject(ball);

    paddle2Comp.ball = ballComp;
};
//# sourceMappingURL=Pong.js.map
