declare module Vapor {
    /**
    * The base class of all objects in Vapor.
    */
    class VaporObject {
        private name;
        /**
        * Gets the name of this VaporObject.
        */
        /**
        * Sets the name of this VaporObject.
        */
        public Name : string;
        /**
        * Creates a new instance of a VaporObject.
        */
        constructor(name?: string);
    }
}
declare module Vapor {
    /**
    * The base class for all functionality that is added to GameObjects.
    * @class Represents a Component
    */
    class Component extends VaporObject {
        /**
        * True if the component is enabled, and therefore Updated and Rendered.
        */
        private enabled;
        /**
        * Gets the enabled state of this Component.
        */
        /**
        * Sets the enabled state of this Component.
        */
        public Enabled : boolean;
        /**
        * The GameObject this Component is attached to
        */
        public gameObject: GameObject;
        /**
        * The Transform of the GameObject
        */
        public transform : Transform;
        /**
        * The Scene that this Component belongs to.
        */
        public scene : Scene;
        /**
        * Called as soon as this Component gets added to a GameObject
        */
        public Awake(): void;
        /**
        * Called when the parent GameObject gets added to a Scene.
        */
        public Start(): void;
        /**
        * Called once per frame.
        */
        public Update(): void;
        /**
        * Called once per frame.  Put rendering code inside here.
        */
        public Render(): void;
    }
}
declare module Vapor {
    /**
    * Represents a Transform.
    * A Transform is what determines the translation (position), rotation (orientation),
    * and scale of a GameObject.
    */
    class Transform extends Component {
        /**
        * Gets the model (aka world, aka transformation) Matrix of the GameObject (before scaling).
        */
        public modelMatrix: Matrix;
        /**
        * The model matrix with the current scaling applied.
        */
        public ScaledModelMatrix : Matrix;
        /**
        * Gets the Quaternion representing the rotation of the GameObject.
        */
        public rotation: Quaternion;
        private eulerAngles;
        private scale;
        private scaleMatrix;
        constructor();
        /**
        * Gets and sets the position of the Transform.
        * @name Vapor.Transform.prototype.position
        * @property
        */
        public position : Vector3;
        /**
        * Gets the location relative to its parent.
        */
        /**
        * Sets the location relative to its parent.
        */
        public localPosition : Vector3;
        /**
        * Gets and sets the right Vector of the Transform.
        * TODO: Convert to use Quaternion:
        * http://nic-gamedev.blogspot.com/2011/11/quaternion-math-getting-local-axis.html
        * @name Vapor.Transform.prototype.right
        */
        public right : Vector3;
        /**
        * Gets and sets the up Vector of the Transform.
        * @name Vapor.Transform.prototype.up
        * @field
        */
        public up : Vector3;
        /**
        * Gets and sets the forward Vector of the Transform.
        * @name Vapor.Transform.prototype.forward
        * @field
        */
        public forward : Vector3;
        /**
        * Gets and sets the euler angles (rotation around X, Y, and Z) of the Transform.
        * @name Vapor.Transform.prototype.eulerAngles
        * @field
        */
        public EulerAngles : Vector3;
        /**
        * Gets and sets the position of the Transform.
        * @name Vapor.Transform.prototype.position
        * @property
        */
        public Scale : Vector3;
        /**
        * Sets the Transform to point at the given target position with the given world up vector.
        * @param {vec3} targetPosition The target position to look at.
        * @param {vec3} worldUp The world up vector.
        */
        public LookAt(targetPosition: Vector3, worldUp: Vector3): void;
        public Rotate(axis: Vector3, angle: number): void;
        public RotateLocalX(angle: number): void;
        public RotateLocalY(angle: number): void;
    }
}
declare module Vapor {
    /**
    * Represents the base object of everything that is in a Scene.
    * @class Represents a GameObject
    */
    class GameObject extends VaporObject {
        /**
        * The list of Components attached to this GameObject.
        */
        public components: Component[];
        /**
        * The list of GameObjects that are children to this GameObject.
        */
        public children: GameObject[];
        /**
        * The parent that this GameObject is a child of.
        */
        public parent: GameObject;
        /**
        * The Scene that this GameObject belongs to.
        */
        public scene: Scene;
        /**
        * The Transform attached to this GameObject.
        */
        public transform: Transform;
        /**
        * The Renderer attached to this GameObject, if there is one.
        */
        public renderer: Renderer;
        /**
        * The Camera attached to this GameObject, if there is one.
        */
        public camera: Camera;
        constructor();
        /**
        * Adds the given Component to this GameObject.
        * @param {Vapor.Component} component The Component to add.
        */
        public AddComponent(component: Component): void;
        /**
        * Called when the GameObject gets added to a Scene.
        */
        public Start(): void;
        /**
        * Gets the Component with the given name attached to this GameObject.
        * @param {string} name The name of the Component to get.
        * @returns {Vapor.Component} The Component, if it's found. Otherwise, null.
        */
        public GetComponentByName(name: string): Component;
        /**
        * Gets the component of the given type (including child types) attached to this GameObject, if there is one.
        * @param {any} type The type of the Component to get.  This can be a parent type as well.
        */
        public GetComponentByType(type: any): Component;
        /**
        * Adds the given GameObject as a child to this GameObject.
        * @param {Vapor.GameObject} child The GameObject child to add.
        */
        public AddChild(child: GameObject): void;
        /**
        * @private
        */
        public Update(): void;
        /**
        * @private
        */
        public Render(): void;
        /**
        * Creates a GameObject with a Camera Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a Camera.
        */
        static CreateCamera(): GameObject;
        /**
        * Creates a GameObject with a triangle Mesh and a MeshRenderer Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a triangle Mesh.
        */
        static CreateTriangle(): GameObject;
        /**
        * Creates a GameObject with a quad Mesh and a MeshRenderer Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a quad Mesh.
        */
        static CreateQuad(): GameObject;
        /**
        * Creates a GameObject with a line Mesh and a MeshRenderer Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a line Mesh.
        */
        static CreateLine(points: Vector3[], width?: number): GameObject;
        /**
        * Creates a GameObject with a circle Mesh and a MeshRenderer Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a quad Mesh.
        */
        static CreateCircle(radius?: number, segments?: number, startAngle?: number, angularSize?: number): GameObject;
    }
}
declare module Vapor {
    /**
    * A Scene is essentially a list of GameObjects.  It updates and renders all GameObjects
    * as well as holds a reference to a Canvas to render to.
    * @class Represents a Scene
    * @param {Vapor.Canvas} [canvas] The Canvas to use.  If not given, it creates its own.
    */
    class Scene extends VaporObject {
        /**
        * The list of GameObjects in the Scene.
        */
        public gameObjects: GameObject[];
        /**
        * The list of Camera Components in the Scene. (Don't add to this list!
        * Add the GameObject containing the Camera to Scene.gameObjects.)
        */
        public cameras: Camera[];
        /**
        * True if the game is paused.
        */
        public paused: boolean;
        /**
        * Gets the first camera in the scene.
        */
        public Camera : Camera;
        /**
        * The [Canvas] used to render the Scene.
        */
        public canvas: Canvas;
        /**
        * The gravity vector used for Box2D.
        */
        private gravity;
        constructor(canvas?: Canvas, gravity?: Vector2);
        /**
        * Adds the given GameObject to the Scene.
        * @param {Vapor.GameObject} gameObject The GameObject to add.
        */
        public AddGameObject(gameObject: GameObject): void;
        /**
        * Removes the given [GameObject] from the [Scene].
        */
        public RemoveGameObject(gameObject: GameObject): void;
        /**
        * Clears all [GameObject]s out of the [Scene].
        */
        public Clear(): void;
        /**
        * @private
        */
        private Update(time);
        /**
        * @private
        */
        private Render();
        /**
        * @private
        */
        private WindowResized(event);
    }
}
declare module Vapor {
    /**
    * A Camera is what renders the GameObjects in the Scene.
    * @class Represents a Camera
    */
    class Camera extends Component {
        /**
        * The Color to clear the background to.  Defaults to UnityBlue.
        */
        public backgroundColor: Vector4;
        /**
        * The angle, in degrees, of the field of view of the Camera.  Defaults to 45.
        */
        public fieldOfView: number;
        /**
        * The aspect ratio (width/height) of the Camera.  Defaults to the GL viewport dimensions.
        */
        public aspect: number;
        /**
        * The distance to the near clipping plane of the Camera.  Defaults to 0.1.
        */
        public nearClipPlane: number;
        /**
        * The distance to the far clipping plane of the Camera.  Defaults to 1000.
        */
        public farClipPlane: number;
        /**
        * The current projection Matrix of the Camera.
        */
        public projectionMatrix: Matrix;
        constructor();
        /**
        * @private
        */
        public Awake(): void;
        /**
        * @private
        */
        public Update(): void;
        /**
        * @private
        * Clears the depth and color buffer.
        */
        public Clear(): void;
        /**
        * @private
        * Resets the projection matrix based on the window size.
        */
        public OnWindowResized(event: Event): void;
        public ScreenToWorld(screenPoint: Vector3, z?: number): Vector3;
        public WorldToScreen(worldPoint: Vector3): Vector3;
    }
}
declare module Vapor {
    class Canvas {
        /**
        * The HTML Canvas Element that is being used for rendering.
        */
        public element: HTMLCanvasElement;
        /**
        * Creates a new instance of a Canvas.
        * @constructor
        * @param {HTMLCanvasElement} [canvasElement] - The existing HTML Canvas Element to use.  If not provided, a new Canvas will be created and appended to the document.
        */
        constructor(canvasElement?: HTMLCanvasElement);
        /**
        *  Resizes the canvas based upon the current browser window size.
        */
        public Resize(): void;
    }
}
declare module Vapor {
    /**
    * Represents an instance of a Shader, with variables to set.
    * @class Represents a Material
    * @param {Vapor.Shader} shader The backing shader that this Material uses.
    */
    class Material extends VaporObject {
        public shader: Shader;
        public textureCount: number;
        private cache;
        private textureIndices;
        constructor(shader: Shader);
        /**
        * Sets up WebGL to use this Material (and backing Shader).
        */
        public Use(): void;
        /**
        * Sets up OpenGL to use this Material (and backing Shader) and sets up
        * the required vertex attributes (position, normal, tex coord, etc).
        */
        public Enable(): void;
        /**
        * Disables the vertex attributes (position, normal, tex coord, etc).
        */
        public Disable(): void;
        /**
        * Sets the matrix of the given name on this Material.
        * @param {string} name The name of the matrix variable to set.
        * @param {mat4} matrix The matrix value to set the variable to.
        */
        public SetMatrix(name: string, matrix: Matrix): void;
        /**
        * Sets the vector of the given name on this Material.
        * @param {string} name The name of the vector variable to set.
        * @param {Vector4} vector The vector value to set the variable to.
        */
        public SetVector(name: string, vector: Vector4): void;
        /**
        * Sets the texture of the given name on this Material.
        * @param {String} name The name of the texture variable to set.
        * @param {Texture2D} texture The texture value to set the variable to.
        */
        public SetTexture(name: string, texture: Texture2D): void;
        /**
        * Converts a normal int index into a WebGL.Texture# int index.
        */
        private TextureIndex(index);
    }
}
declare module Vapor {
    /**
    * Represents a 3D model that is rendered.
    * @class Represents a Mesh
    */
    class Mesh extends VaporObject {
        private vertices;
        public vertexBuffer: WebGLBuffer;
        public vertexCount: number;
        /**
        * Gets and sets the vertices making up this Mesh.
        * @name Vapor.Mesh.prototype.vertices
        * @property
        */
        public Vertices : Float32Array;
        private uv;
        public uvBuffer: WebGLBuffer;
        /**
        * Gets and sets the texture coodinates for each vertex making up this Mesh.
        * @name Vapor.Mesh.prototype.uv
        * @property
        */
        public UV : Float32Array;
        private normals;
        public normalBuffer: WebGLBuffer;
        /**
        * Gets and sets the normal vectors for each vertex making up this Mesh.
        * @name Vapor.Mesh.prototype.normals
        * @property
        */
        public Normals : Float32Array;
        private triangles;
        public indexBuffer: WebGLBuffer;
        public indexCount: number;
        /**
        * Gets and sets the index buffer of this Mesh. This defines which vertices make up what triangles.
        * @name Vapor.Mesh.prototype.triangles
        * @property
        */
        public Triangles : Uint16Array;
        /**
        * Draws the mesh using the given Material
        * @param {Vapor.Material} material The Material to use to render the mesh.
        */
        public Render(material: Material): void;
        /**
        * Creates a new Mesh containing data for a triangle.
        * @returns {Vapor.Mesh} The new Mesh representing a triangle.
        */
        static CreateTriangle(): Mesh;
        /**
        * Creates a new Mesh containing data for a quad.
        * @returns {Vapor.Mesh} The new Mesh representing a quad.
        */
        static CreateQuad(): Mesh;
        /**
        * Creates a new Mesh containing data for a line.
        * @returns {Vapor.Mesh} The new Mesh representing a line.
        */
        static CreateLine(points: Vector3[], width?: number): Mesh;
        /**
        * Creates a Mesh with vertices forming a 2D circle.
        * radius - Radius of the circle. Value should be greater than or equal to 0.0. Defaults to 1.0.
        * segments - The number of segments making up the circle. Value should be greater than or equal to 3. Defaults to 15.
        * startAngle - The starting angle of the circle.  Defaults to 0.
        * angularSize - The angular size of the circle.  2 pi is a full circle. Pi is a half circle. Defaults to 2 pi.
        */
        static CreateCircle(radius?: number, segments?: number, startAngle?: number, angularSize?: number): Mesh;
        /**
        * Convert a list of Vector3 objects into a Float32List object
        */
        private static CreateFloat32List3(vectorList);
        /**
        * Convert a list of Vector2 objects into a Float32List object
        */
        private static CreateFloat32List2(vectorList);
    }
}
declare module Vapor {
    /**
    * The base behavior that is used to render anything.
    * @class Represents a Renderer
    * @see Vapor.Behavior
    */
    class Renderer extends Component {
        /**
        * The Vapor.Material that this Renderer uses.
        * @type Vapor.Material
        */
        public material: Material;
        /**
        * @private
        */
        public Update(): void;
        /**
        * @private
        */
        public Render(): void;
    }
}
declare module Vapor {
    /**
    * Represents a Renderer behavior that is used to render a mesh.
    * @class Represents a MeshRenderer
    */
    class MeshRenderer extends Renderer {
        /**
        * The mesh that this MeshRenderer will draw.
        */
        public mesh: Mesh;
        /**
        * @private
        */
        public Render(): void;
    }
}
declare module Vapor {
    /**
    * Represents a shader program.
    * @class Represents a Shader
    */
    class Shader {
        public vertexShader: WebGLShader;
        public pixelShader: WebGLShader;
        public program: WebGLProgram;
        public filepath: string;
        public usesTexCoords: boolean;
        public usesNormals: boolean;
        public vertexPositionAttribute: number;
        public textureCoordAttribute: number;
        public vertexNormalAttribute: number;
        private static vertexShaderPreprocessor;
        private static pixelShaderPreprocessor;
        /**
        * Sets up WebGL to use this Shader.
        */
        public Use(): void;
        /**
        * Loads a shader from the given file path.
        * @param {string} filepath The filepath of the shader to load.
        * @returns {Vapor.Shader} The newly created Shader.
        */
        static FromFile(filepath: string): Shader;
        /**
        * Loads a shader from a script tag with the given ID.
        * @param {string} shaderScriptID The ID of the script tag to load as a Shader.
        * @returns {Vapor.Shader} The newly created Shader.
        */
        static FromScript(shaderScriptID: string): Shader;
        /**
        * Loads a shader from the given source code (text).
        * @param {string} shaderSource The full source (text) of the shader.
        * @param {string} [filepath] The current filepath to work from. (Used for including other shader code.)
        * @returns {Vapor.Shader} The newly created Shader.
        */
        static FromSource(shaderSource: string, filepath?: string): Shader;
        /**
        @private
        */
        private static LoadShaderSourceFromScript(shaderScriptID);
        /**
        * @private
        * Process the shader source and pull in the include code
        */
        private static PreprocessSource(shaderSource, filepath?);
        /**
        @private
        */
        private static CompileShader(shaderType, source);
    }
}
declare module Vapor {
    /**
    * An enumeration of the different types of shader.
    */
    enum ShaderType {
        /**
        * The type for a Vertex Shader
        */
        VertexShader = 0,
        /**
        * The type for a Fragment (Pixel) Shader
        */
        FragmentShader = 1,
    }
}
declare module Vapor {
    class Texture2D extends VaporObject {
        /**
        * The actual HTML image element.
        */
        public image: HTMLImageElement;
        /**
        * The OpenGL Texture object.
        */
        public glTexture: WebGLTexture;
        /**
        * The callback that is called when the texture is done loading.
        * In the form: void Callback(Texture2D texture)
        */
        public LoadedCallback: (texture: Texture2D) => any;
        constructor(texturePath: string);
        private Loaded(e);
    }
}
declare module Vapor {
    class Keyboard {
        private static previousFrame;
        private static currentFrame;
        private static nextFrame;
        static Initialize(): void;
        private static KeyDown(event);
        private static KeyUp(event);
        /**
        * @private
        * Internal method to update the keyboard frame data (only used in Vapor.Game.Scene).
        */
        static Update(): void;
        /**
        * Gets the state for the given key code.
        * Returns true for every frame that the key is down, like autofire.
        * @param {Vapor.Input.KeyCode} keyCode The key code to check.
        * @returns {boolean} True if the key is currently down, otherwise false.
        */
        static GetKey(keyCode: number): boolean;
        /**
        * Returns true during the frame the user pressed the given key.
        * @param {Vapor.Input.KeyCode} keyCode The key code to check.
        * @returns {boolean} True if the key was pressed this frame, otherwise false.
        */
        static GetKeyDown(keyCode: number): boolean;
        /**
        * Returns true during the frame the user released the given key.
        * @param {Vapor.Input.KeyCode} keyCode The key code to check.
        * @returns {boolean} True if the key was released this frame, otherwise false.
        */
        static GetKeyUp(keyCode: number): boolean;
    }
}
declare module Vapor {
    /**
    * An enumeration of the different possible keys to press.
    */
    enum KeyCode {
        A = 65,
        B = 66,
        C = 67,
        D = 68,
        E = 69,
        F = 70,
        G = 71,
        H = 72,
        I = 73,
        J = 74,
        K = 75,
        L = 76,
        M = 77,
        N = 78,
        O = 79,
        P = 80,
        Q = 81,
        R = 82,
        S = 83,
        T = 84,
        U = 85,
        V = 86,
        W = 87,
        X = 88,
        Y = 89,
        Z = 90,
    }
}
declare module Vapor {
    class Vector3 {
        public data: Float32Array;
        public X : number;
        public Y : number;
        public Z : number;
        /**
        * Creates a new instance of a Vector3 initialized to the given values or [0, 0, 0].
        * @constructor
        */
        constructor(x?: number, y?: number, z?: number);
        static Copy(other: Vector3): Vector3;
        /**
        * Adds the given Vector3 to this Vector3
        * @param {Vector3} other - The Vector3 to add to this one
        */
        public Add(other: Vector3): void;
        /**
        * Adds the given Vector3 objects together and returns the result.
        * @param {Vector3} a - The first Vector3 to add.
        * @param {Vector3} b - The second Vector3 to add.
        * @returns {Vector3} The sum of a and b.
        */
        static Add(a: Vector3, b: Vector3): Vector3;
        /**
        * Subtracts the given Vector3 from this Vector3.
        *
        * @param {Vector3} other - The Vector3 to subtract from this one
        */
        public Subtract(other: Vector3): void;
        public ApplyProjection(arg: Matrix): Vector3;
    }
}
declare module Vapor {
    class Mouse {
        private static previousFrame;
        private static currentFrame;
        private static nextFrame;
        private static nextMousePosition;
        private static mousePosition;
        private static deltaMousePosition;
        static Initialize(): void;
        private static MouseDown(event);
        private static MouseUp(event);
        private static MouseMove(event);
        /**
        * @private
        * Internal method to update the mouse frame data (only used in Vapor.Game.Scene).
        */
        static Update(): void;
        /**
        * Gets the state for the given mouse button index.
        * Returns true for every frame that the button is down, like autofire.
        * @param {int} button The mouse button index to check. 0 = left, 1 = middle, 2 = right.
        * @returns {boolean} True if the button is currently down, otherwise false.
        */
        static GetMouseButton(button: number): boolean;
        /**
        * Returns true during the frame the user pressed the given mouse button.
        * @param {int} button The mouse button index to check. 0 = left, 1 = middle, 2 = right.
        * @returns {boolean} True if the button was pressed this frame, otherwise false.
        */
        static GetMouseButtonDown(button: number): boolean;
        /**
        * Returns true during the frame the user releases the given mouse button.
        * @param {int} button The mouse button index to check. 0 = left, 1 = middle, 2 = right.
        * @returns {boolean} True if the button was released this frame, otherwise false.
        */
        static GetMouseButtonUp(button: number): boolean;
    }
}
declare module Vapor {
    class TouchInput {
        private static previousFrame;
        private static currentFrame;
        private static nextFrame;
        static Initialize(): void;
        private static TouchStart(event);
        private static TouchEnd(event);
        private static TouchMove(event);
        /**
        * @private
        * Internal method to update the mouse frame data (only used in Vapor.Game.Scene).
        */
        static Update(): void;
        /**
        * Gets the touch object stored at the given index.
        * @param {int} index The index of the touch to get.
        * @returns {Vapor.Input.Touch} The touch object at the given index
        */
        static GetTouch(index: number): TouchData;
        /**
        * Number of touches. Guaranteed not to change throughout the frame.
        */
        static TouchCount : number;
    }
}
interface Touch {
    identifier: number;
    target: EventTarget;
    screenX: number;
    screenY: number;
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
}
interface TouchList {
    length: number;
    item(index: number): Touch;
    identifiedTouch(identifier: number): Touch;
}
interface TouchEvent extends UIEvent {
    touches: TouchList;
    targetTouches: TouchList;
    changedTouches: TouchList;
    altKey: boolean;
    metaKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    initTouchEvent(type: string, canBubble: boolean, cancelable: boolean, view: Window, detail: number, ctrlKey: boolean, altKey: boolean, shiftKey: boolean, metaKey: boolean, touches: TouchList, targetTouches: TouchList, changedTouches: TouchList): any;
}
declare var TouchEvent: {
    prototype: TouchEvent;
    new(): TouchEvent;
};
interface HTMLElement extends Element, ElementCSSInlineStyle, MSEventAttachmentTarget, MSNodeExtensions {
    ontouchstart: (ev: TouchEvent) => any;
    ontouchmove: (ev: TouchEvent) => any;
    ontouchend: (ev: TouchEvent) => any;
    ontouchcancel: (ev: TouchEvent) => any;
}
interface Document extends Node, NodeSelector, MSEventAttachmentTarget, DocumentEvent, MSResourceMetadata, MSNodeExtensions {
    ontouchstart: (ev: TouchEvent) => any;
    ontouchmove: (ev: TouchEvent) => any;
    ontouchend: (ev: TouchEvent) => any;
    ontouchcancel: (ev: TouchEvent) => any;
}
declare module Vapor {
    /**
    * Contains the data for a certain touch.
    */
    class TouchData {
        /**
        * The unique index for touch.
        */
        public fingerId: number;
        /**
        * The position of the touch.
        */
        public position: Vector3;
        /**
        * The position delta since last change.
        */
        public deltaPosition: Vector3;
        /**
        * Amount of time passed since last change.
        */
        public deltaTime: number;
        /**
        * Number of taps.
        */
        public tapCount: number;
        /**
        * Describes the phase of the touch.
        */
        public phase: TouchPhase;
    }
}
declare module Vapor {
    /**
    * Enumeration of the possible touch phases.
    */
    enum TouchPhase {
        /**
        * A finger touched the screen.
        */
        Began = 0,
        /**
        * A finger moved on the screen.
        */
        Moved = 1,
        /**
        * A finger is touching the screen but hasn't moved.
        */
        Stationary = 2,
        /**
        * A finger was lifted from the screen. This is the final phase of a touch.
        */
        Ended = 3,
        /**
        * The system cancelled tracking for the touch. This is the final phase of a touch.
        */
        Canceled = 4,
    }
}
declare module Vapor {
    class Vector4 {
        public data: Float32Array;
        public X : number;
        public Y : number;
        public Z : number;
        public W : number;
        /**
        * Creates a new instance of a Vector4 initialized to the given values or [0, 0, 0, 0].
        * @constructor
        */
        constructor(x?: number, y?: number, z?: number, w?: number);
        static Copy(other: Vector4): Vector4;
        /**
        * Adds the given Vector4 to this Vector4
        * @param {Vector4} other - The Vector4 to add to this one
        */
        public Add(other: Vector4): void;
        /**
        * Adds the given Vector4 objects together and returns the result.
        * @param {Vector4} a - The first Vector4 to add.
        * @param {Vector4} b - The second Vector4 to add.
        * @returns {Vector4} The sum of a and b.
        */
        static Add(a: Vector4, b: Vector4): Vector4;
        /**
        * Subtracts the given Vector4 from this Vector4.
        *
        * @param {Vector4} other - The Vector4 to subtract from this one
        */
        public Subtract(other: Vector4): void;
    }
}
declare module Vapor {
    class Color {
        /**
        * Creates a new Color from the given integers.
        * @param {number} r Red. 0-255.
        * @param {number} g Green. 0-255.
        * @param {number} b Blue. 0-255.
        * @param {number} a Alpha. 0-255.
        * @returns {Vector4} The new Color.
        */
        static FromInts(r: number, g: number, b: number, a: number): Vector4;
        /**
        * Red (255, 0, 0, 255)
        */
        static Red: Vector4;
        /**
        * Green (0, 255, 0, 255)
        */
        static Green: Vector4;
        /**
        * Blue (0, 0, 255, 255)
        */
        static Blue: Vector4;
        /**
        * Cornflower Blue (100, 149, 237, 255)
        */
        static CornflowerBlue: Vector4;
        /**
        * Unity Blue (49, 77, 121, 255)
        */
        static UnityBlue: Vector4;
        /**
        * Solid Black (0, 0, 0, 255)
        */
        static SolidBlack: Vector4;
        /**
        * Solid White (255, 255, 255, 255)
        */
        static SolidWhite: Vector4;
        /**
        * Transparent Black (0, 0, 0, 0)
        */
        static TransparentBlack: Vector4;
        /**
        * Transparent White (255, 255, 255, 0)
        */
        static TransparentWhite: Vector4;
    }
}
declare module Vapor {
    class BoundingBox2D {
        private min;
        private max;
        public Min : Vector2;
        public Max : Vector2;
        /**
        * Creates a new instance of a BoundingBox2D initialized to the given values or 0s.
        * @constructor
        */
        constructor(min?: Vector2, max?: Vector2);
        /**
        * Return true if this intersects with given BoundingBox.
        * @param {BoundingBox2D} other - The BoundingBox2D to check intersection with.
        */
        public IntersectsBoundingBox(other: BoundingBox2D): boolean;
    }
}
declare module Vapor {
    class BoundingBox3D {
        private min;
        private max;
        public Min : Vector3;
        public Max : Vector3;
        /**
        * Creates a new instance of a BoundingBox3D initialized to the given values or 0s.
        * @constructor
        */
        constructor(min?: Vector3, max?: Vector3);
        /**
        * Return true if this intersects with given BoundingBox.
        * @param {BoundingBox3D} other - The BoundingBox3D to check intersection with.
        */
        public IntersectsBoundingBox(other: BoundingBox3D): boolean;
    }
}
declare module Vapor {
    class MathHelper {
        static ToRadians(degrees: number): number;
    }
}
declare module Vapor {
    class Matrix {
        public data: Float32Array;
        private static EPSILON;
        /**
        * Creates a new instance of a Matrix initialized to the identity matrix.
        * @constructor
        */
        constructor();
        public SetIdentity(): void;
        public SetZero(): void;
        static Copy(other: Matrix): Matrix;
        /**
        * Multiplies two Matrix objects.
        *
        * @param {Matrix} a - The first operand
        * @param {Matrix} b - The second operand
        * @returns {Matrix} The result of the multiplication.
        */
        static Multiply(a: Matrix, b: Matrix): Matrix;
        /**
        * Rotates this Matrix by the given angle
        *
        * @param {Vector3} axis - The axis to rotate around
        * @param {Number} angle - The angle to rotate the matrix by (in radians)
        */
        public Rotate(axis: Vector3, angle: number): any;
        /**
        * Scales this Matrix by the dimensions in the given Vector3
        *
        * @param {Vector3} scale - The Vector3 to scale the matrix by
        **/
        public Scale(scale: Vector3): void;
        /**
        * Sets this Matrix to the given rotation (Quaternion) and translation (Vector3)
        *
        * @param {Vector3} position - Translation vector
        * @param {Quaternion} rotation - Rotation quaternion
        */
        public FromTranslationRotation(position: Vector3, rotation: Quaternion): void;
        /**
        * Generates a look-at matrix with the given eye position, focal point, and up axis
        *
        * @param {vec3} eye Position of the viewer
        * @param {vec3} center Point the viewer is looking at
        * @param {vec3} up vec3 pointing up
        */
        public SetLookAt(eye: Vector3, center: Vector3, up: Vector3): void;
        /**
        * Constructs an OpenGL perspective projection matrix in this Matrix.
        *
        * [fovYRadians] specifies the field of view angle, in radians, in the y direction.
        * [aspectRatio] specifies the aspect ratio that determines the field of view in the x direction.
        *  The aspect ratio of x (width) to y (height).
        * [zNear] specifies the distance from the viewer to the near plane (always positive).
        * [zFar] specifies the distance from the viewer to the far plane (always positive).
        */
        public SetPerspectiveMatrix(fovYRadians: number, aspectRatio: number, zNear: number, zFar: number): void;
        /**
        * Constructs an OpenGL perspective projection matrix in this Matrix.
        *
        * [left], [right] specify the coordinates for the left and right vertical clipping planes.
        * [bottom], [top] specify the coordinates for the bottom and top horizontal clipping planes.
        * [near], [far] specify the coordinates to the near and far depth clipping planes.
        */
        public SetFrustumMatrix(left: number, right: number, bottom: number, top: number, near: number, far: number): void;
        /**
        * On success, Sets [pickWorld] to be the world space position of
        * the screen space [pickX], [pickY], and [pickZ].
        *
        * The viewport is specified by ([viewportX], [viewportWidth]) and
        * ([viewportY], [viewportHeight]).
        *
        * [cameraMatrix] includes both the projection and view transforms.
        *
        * [pickZ] is typically either 0.0 (near plane) or 1.0 (far plane).
        *
        * Returns false on error, for example, the mouse is not in the viewport
        *
        */
        static Unproject(cameraMatrix: Matrix, viewportX: number, viewportWidth: number, viewportY: number, viewportHeight: number, pickX: number, pickY: number, pickZ: number, pickWorld: Vector3): boolean;
        public Invert(): number;
        /**
        * Transforms the given Vector4 by this Matrix.
        *
        */
        public Transform(arg: Vector4): Vector4;
    }
}
declare module Vapor {
    class Quaternion {
        public data: Float32Array;
        /**
        * Creates a new instance of a Quaternion initialized to the identity.
        * @constructor
        */
        constructor();
        /**
        * Set quaternion with rotation of yaw, pitch and roll stored in the given Vector3.
        */
        public SetEuler(eulerAngles: Vector3): void;
    }
}
declare module Vapor {
    class Vector2 {
        public data: Float32Array;
        public X : number;
        public Y : number;
        /**
        * Creates a new instance of a Vector3 initialized to the given values or [0, 0].
        * @constructor
        */
        constructor(x?: number, y?: number);
        /**
        * Adds the given Vector2 to this Vector2
        * @param {Vector2} other - The Vector2 to add to this one
        */
        public Add(other: Vector2): void;
        /**
        * Adds the given Vector2 objects together and returns the result.
        * @param {Vector2} a - The first Vector2 to add.
        * @param {Vector2} b - The second Vector2 to add.
        * @returns {Vector2} The sum of a and b.
        */
        static Add(a: Vector2, b: Vector2): Vector2;
    }
}
interface Array<T> {
    /**
    * Adds the given item to the end of the array.
    */
    add(item: T): any;
    /**
    * Clears the array.
    */
    clear(): any;
    /**
    * Creates a copy of the array.
    */
    clone(): T[];
    /**
    * Removes the given item from the array.
    */
    remove(item: T): any;
    /**
    * Removes the item at the given index from the array.
    */
    removeAt(index: number): any;
}
declare module Vapor {
    class FileDownloader {
        /**
        * Download the file at the given URL.
        * It defaults to download sychronously.
        * You can optionally provide a callback function which forces it to download asychronously.
        * The callback is in the form: void Callback(ProgressEvent event)
        */
        static Download(url: string, callback?: (event: ProgressEvent) => any): XMLHttpRequest;
    }
}
declare class List<T> {
    private data;
    constructor();
    public Add(item: T): void;
    public Remove(item: T): void;
    public RemoveAt(index: number): void;
    public Clear(): void;
    public Get(index: number): T;
    [n: number]: T;
}
declare module Vapor {
    /**
    * A static class offering access to time related fields.
    * @class Represents a Mesh
    */
    class Time {
        /**
        * The amount of time that has passed since the last frame, in seconds.
        */
        static deltaTime: number;
        /**
        * The time of the previous frame, in milliseconds.
        */
        private static previousTime;
        /**
        * @private
        */
        static Update(): void;
    }
}
/**
* The global handle to the current instance of the WebGL rendering context.
*/ 
declare var gl: WebGLRenderingContext;
