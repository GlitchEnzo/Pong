window.onload = () => {
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