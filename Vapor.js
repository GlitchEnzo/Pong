var Vapor;
(function (Vapor) {
    /**
    * A wrapper around the Web Audio API AudioContext object
    * @class Represents an AudioManager
    */
    var AudioManager = (function () {
        function AudioManager() {
            this.context = new AudioContext();
        }
        return AudioManager;
    })();
    Vapor.AudioManager = AudioManager;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    /**
    * A wrapper around the Web AudioSource API AudioBuffer object
    * @class Represents an AudioManager
    */
    var AudioSource = (function () {
        function AudioSource(manager) {
            this.loaded = false;
            this.manager = manager;
            //this.source = manager.context.createBufferSource();
            //this.source.connect(manager.context.destination);
        }
        //public LoadAudio(url: string, callback: (source: AudioSource) => any) {
        //    FileDownloader.DownloadArrayBuffer(url, (request) => {
        //        this.manager.context.decodeAudioData(request.response, (buffer) => {
        //            this.source.buffer = buffer;
        //            this.loaded = true;
        //            callback(this);
        //        });
        //    });
        //}
        AudioSource.prototype.Play = function (startTime) {
            if (typeof startTime === "undefined") { startTime = this.pauseTime; }
            this.source = this.manager.context.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.connect(this.manager.context.destination);
            this.source.start(0, startTime);

            // save the start time
            this.startTime = performance.now();
        };

        AudioSource.prototype.Pause = function () {
            this.source.stop(0);

            this.pauseTime = performance.now() - this.startTime;
        };

        AudioSource.prototype.Stop = function () {
            this.source.stop(0);

            this.startTime = 0;
            this.pauseTime = 0;
        };

        AudioSource.FromFile = function (manager, url, callback) {
            var source = new AudioSource(manager);
            Vapor.FileDownloader.DownloadArrayBuffer(url, function (request) {
                source.manager.context.decodeAudioData(request.response, function (buffer) {
                    source.buffer = buffer;

                    //source.source.buffer = buffer;
                    source.loaded = true;
                    callback(source);
                });
            });
        };
        return AudioSource;
    })();
    Vapor.AudioSource = AudioSource;
})(Vapor || (Vapor = {}));
// Type definitions for Web Audio API
// Project: http://www.w3.org/TR/webaudio/
// Definitions by: Baruch Berger <https://github.com/bbss>, Kon <http://phyzkit.net/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
























var Vapor;
(function (Vapor) {
    /**
    * The base class of all objects in Vapor.
    */
    var VaporObject = (function () {
        /**
        * Creates a new instance of a VaporObject.
        */
        function VaporObject(name) {
            if (typeof name === "undefined") { name = "VaporObject"; }
            this.Name = name;
        }
        Object.defineProperty(VaporObject.prototype, "Name", {
            /**
            * Gets the name of this VaporObject.
            */
            get: function () {
                return this.name;
            },
            /**
            * Sets the name of this VaporObject.
            */
            set: function (value) {
                this.name = value;
            },
            enumerable: true,
            configurable: true
        });

        return VaporObject;
    })();
    Vapor.VaporObject = VaporObject;
})(Vapor || (Vapor = {}));
/// <reference path="VaporObject.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vapor;
(function (Vapor) {
    /**
    * The base class for all functionality that is added to GameObjects.
    * @class Represents a Component
    */
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component() {
            _super.apply(this, arguments);
            /**
            * True if the component is enabled, and therefore Updated and Rendered.
            */
            this.enabled = true;
        }
        Object.defineProperty(Component.prototype, "Enabled", {
            /**
            * Gets the enabled state of this Component.
            */
            get: function () {
                return this.enabled;
            },
            /**
            * Sets the enabled state of this Component.
            */
            set: function (value) {
                this.enabled = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Component.prototype, "transform", {
            /**
            * The Transform of the GameObject
            */
            get: function () {
                return this.gameObject.transform;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Component.prototype, "scene", {
            /**
            * The Scene that this Component belongs to.
            */
            get: function () {
                return this.gameObject.scene;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Called as soon as this Component gets added to a GameObject
        */
        Component.prototype.Awake = function () {
        };

        /**
        * Called when the parent GameObject gets added to a Scene.
        */
        Component.prototype.Start = function () {
        };

        /**
        * Called once per frame.
        */
        Component.prototype.Update = function () {
        };

        /**
        * Called once per frame.  Put rendering code inside here.
        */
        Component.prototype.Render = function () {
        };

        /**
        * Called whenver collisions are detected via the physics engine (Box2D).
        */
        Component.prototype.OnCollision = function (contact) {
        };
        return Component;
    })(Vapor.VaporObject);
    Vapor.Component = Component;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    /**
    * Represents a Transform.
    * A Transform is what determines the translation (position), rotation (orientation),
    * and scale of a GameObject.
    */
    var Transform = (function (_super) {
        __extends(Transform, _super);
        function Transform() {
            _super.call(this, "Transform");

            this.modelMatrix = new Vapor.Matrix();
            this.rotation = new Vapor.Quaternion();
            this.eulerAngles = new Vapor.Vector3();
            this.scale = new Vapor.Vector3(1.0, 1.0, 1.0);
            this.scaleMatrix = new Vapor.Matrix();
        }
        Object.defineProperty(Transform.prototype, "ScaledModelMatrix", {
            /**
            * The model matrix with the current scaling applied.
            */
            get: function () {
                // TODO: Optimize this to only do the multiplication when needed.
                //return this.modelMatrix * this.scaleMatrix;
                return Vapor.Matrix.Multiply(this.modelMatrix, this.scaleMatrix);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Transform.prototype, "position", {
            /**
            * Gets and sets the position of the Transform.
            * @name Vapor.Transform.prototype.position
            * @property
            */
            get: function () {
                return new Vapor.Vector3(this.modelMatrix.data[12], this.modelMatrix.data[13], this.modelMatrix.data[14]);
            },
            set: function (value) {
                for (var i = 0; i < this.gameObject.children.length; i++) {
                    var child = this.gameObject.children[i];

                    // TODO: Set the position in local space, not world space.
                    child.transform.position = child.transform.localPosition;
                    child.transform.position.Add(value);
                }

                this.modelMatrix.data[12] = value.data[0];
                this.modelMatrix.data[13] = value.data[1];
                this.modelMatrix.data[14] = value.data[2];
                // Change RigidBody position as well, if there is one
                //if (this.gameObject.rigidbody != null && this.gameObject.rigidbody.body != null) {
                //    // use the body's angle, since we only care about position here
                //    gameObject.rigidbody.body.setTransform(this.position.xy, this.gameObject.rigidbody.body.angle);
                //}
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Transform.prototype, "localPosition", {
            /**
            * Gets the location relative to its parent.
            */
            get: function () {
                // if there is no parent, the local position is the world position
                var local = this.position;
                if (this.gameObject.parent != null) {
                    // TODO: Use local space, not world space.
                    //local = local - this.gameObject.parent.transform.position;
                    local.Subtract(this.gameObject.parent.transform.position);
                }
                return local;
            },
            /**
            * Sets the location relative to its parent.
            */
            set: function (value) {
                if (this.gameObject.parent != null) {
                    // TODO: Use local space, not world space.
                    this.position = this.gameObject.parent.transform.position;
                    this.position.Add(value);
                } else {
                    this.position = value;
                }
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Transform.prototype, "right", {
            /**
            * Gets and sets the right Vector of the Transform.
            * TODO: Convert to use Quaternion:
            * http://nic-gamedev.blogspot.com/2011/11/quaternion-math-getting-local-axis.html
            * @name Vapor.Transform.prototype.right
            */
            get: function () {
                return new Vapor.Vector3(this.modelMatrix.data[0], this.modelMatrix.data[1], this.modelMatrix.data[2]);
            },
            set: function (value) {
                this.modelMatrix.data[0] = value.data[0];
                this.modelMatrix.data[1] = value.data[1];
                this.modelMatrix.data[2] = value.data[2];
                // TODO: Recalc forward and up
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Transform.prototype, "up", {
            /**
            * Gets and sets the up Vector of the Transform.
            * @name Vapor.Transform.prototype.up
            * @field
            */
            get: function () {
                return new Vapor.Vector3(this.modelMatrix.data[4], this.modelMatrix.data[5], this.modelMatrix.data[6]);
            },
            set: function (value) {
                this.modelMatrix.data[4] = value.data[0];
                this.modelMatrix.data[5] = value.data[1];
                this.modelMatrix.data[6] = value.data[2];
                // TODO: Recalc forward and right
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Transform.prototype, "forward", {
            /**
            * Gets and sets the forward Vector of the Transform.
            * @name Vapor.Transform.prototype.forward
            * @field
            */
            get: function () {
                return new Vapor.Vector3(-this.modelMatrix.data[8], -this.modelMatrix.data[9], -this.modelMatrix.data[10]);
            },
            set: function (value) {
                this.modelMatrix.data[8] = -value.data[0];
                this.modelMatrix.data[9] = -value.data[1];
                this.modelMatrix.data[10] = -value.data[2];
                // TODO: Recalc up and right
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Transform.prototype, "EulerAngles", {
            /**
            * Gets and sets the euler angles (rotation around X, Y, and Z) of the Transform.
            * @name Vapor.Transform.prototype.eulerAngles
            * @field
            */
            get: function () {
                // TODO: Actually calculate the angles instead of using old values.
                return this.eulerAngles;
            },
            set: function (value) {
                this.eulerAngles = value;
                this.rotation.SetEuler(value);
                this.modelMatrix.FromTranslationRotation(this.position, this.rotation);
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Transform.prototype, "Scale", {
            /**
            * Gets and sets the position of the Transform.
            * @name Vapor.Transform.prototype.position
            * @property
            */
            get: function () {
                return this.scale;
            },
            set: function (value) {
                this.scale = value;
                this.scaleMatrix.Scale(this.scale);
            },
            enumerable: true,
            configurable: true
        });


        /**
        * Sets the Transform to point at the given target position with the given world up vector.
        * @param {vec3} targetPosition The target position to look at.
        * @param {vec3} worldUp The world up vector.
        */
        Transform.prototype.LookAt = function (targetPosition, worldUp) {
            // TODO: worldUp should only be a hint, not "solid"
            this.modelMatrix.SetLookAt(this.position, targetPosition, worldUp);
        };

        Transform.prototype.Rotate = function (axis, angle) {
            this.modelMatrix.Rotate(axis, angle);
        };

        Transform.prototype.RotateLocalX = function (angle) {
            this.Rotate(this.right, angle);
        };

        Transform.prototype.RotateLocalY = function (angle) {
            this.Rotate(this.up, angle);
        };
        return Transform;
    })(Vapor.Component);
    Vapor.Transform = Transform;
})(Vapor || (Vapor = {}));
/*
// Get roll, pitch, yaw from Quaternion
// From: http://stackoverflow.com/questions/6870469/convert-opengl-4x4-matrix-to-rotation-angles
final double roll = Math.atan2(2 * (quat.getW() * quat.getX() + quat.getY() * quat.getZ()),
1 - 2 * (quat.getX() * quat.getX() + quat.getY() * quat.getY()));
final double pitch = Math.asin(2 * (quat.getW() * quat.getY() - quat.getZ() * quat.getY()));
final double yaw = Math.atan2(2 * (quat.getW() * quat.getZ() + quat.getX() * quat.getY()), 1 - 2 * (quat.getY()
* quat.getY() + quat.getZ() * quat.getZ()));
*/
/// <reference path="../Math/Transform.ts" />
var Vapor;
(function (Vapor) {
    /**
    * Represents the base object of everything that is in a Scene.
    * @class Represents a GameObject
    */
    var GameObject = (function (_super) {
        __extends(GameObject, _super);
        function GameObject() {
            _super.call(this, "GameObject");
            /**
            * The list of Components attached to this GameObject.
            */
            this.components = new Array();
            /**
            * The list of GameObjects that are children to this GameObject.
            */
            this.children = new Array();
            /**
            * The parent that this GameObject is a child of.
            */
            this.parent = null;
            this.transform = new Vapor.Transform();
            this.AddComponent(this.transform);
        }
        /**
        * Adds the given Component to this GameObject.
        * @param {Vapor.Component} component The Component to add.
        */
        GameObject.prototype.AddComponent = function (component) {
            component.gameObject = this;

            if (component instanceof Vapor.Camera) {
                this.camera = component;
            } else if (component instanceof Vapor.Renderer) {
                this.renderer = component;
            } else if (component instanceof Vapor.RigidBody) {
                this.rigidbody = component;
            } else if (component instanceof Vapor.Collider) {
                this.collider = component;
            }

            this.components.push(component);

            component.Awake();
        };

        /**
        * Called when the GameObject gets added to a Scene.
        */
        GameObject.prototype.Start = function () {
            for (var i = 0; i < this.components.length; i++) {
                this.components[i].Start();
            }
        };

        /**
        * Gets the Component with the given name attached to this GameObject.
        * @param {string} name The name of the Component to get.
        * @returns {Vapor.Component} The Component, if it's found. Otherwise, null.
        */
        GameObject.prototype.GetComponentByName = function (name) {
            var found = null;
            for (var i = 0; i < this.components.length; i++) {
                if (this.components[i].Name == name) {
                    found = this.components[i];
                    break;
                }
            }

            return found;
        };

        /**
        * Gets the component of the given type (including child types) attached to this GameObject, if there is one.
        * @param {any} type The type of the Component to get.  This can be a parent type as well.
        */
        GameObject.prototype.GetComponentByType = function (type) {
            var found = null;
            for (var i = 0; i < this.components.length; i++) {
                if (this.components[i] instanceof type) {
                    found = this.components[i];
                    break;
                }
            }

            return found;
        };

        /**
        * Adds the given GameObject as a child to this GameObject.
        * @param {Vapor.GameObject} child The GameObject child to add.
        */
        GameObject.prototype.AddChild = function (child) {
            child.parent = this;

            //child.rigidbody = this.rigidbody;
            this.children.push(child);
        };

        /**
        * @private
        */
        GameObject.prototype.Update = function () {
            for (var i = 0; i < this.components.length; i++) {
                if (this.components[i].Enabled) {
                    this.components[i].Update();
                }
            }
        };

        /**
        * @private
        */
        GameObject.prototype.Render = function () {
            for (var i = 0; i < this.components.length; i++) {
                if (this.components[i].Enabled) {
                    this.components[i].Render();
                }
            }
        };

        GameObject.prototype.OnCollision = function (contact) {
            for (var i = 0; i < this.components.length; i++) {
                this.components[i].OnCollision(contact);
            }
        };

        // ------ Static Creation Methods -------------------------------------------
        /**
        * Creates a GameObject with a Camera Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a Camera.
        */
        GameObject.CreateCamera = function () {
            var cameraObject = new GameObject();
            cameraObject.Name = "Camera";

            var camera = new Vapor.Camera();
            cameraObject.AddComponent(camera);

            return cameraObject;
        };

        /**
        * Creates a GameObject with a triangle Mesh and a MeshRenderer Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a triangle Mesh.
        */
        GameObject.CreateTriangle = function () {
            var triangleObject = new GameObject();
            triangleObject.Name = "Triangle";

            var meshRenderer = new Vapor.MeshRenderer();
            meshRenderer.mesh = Vapor.Mesh.CreateTriangle();
            triangleObject.AddComponent(meshRenderer);

            return triangleObject;
        };

        /**
        * Creates a GameObject with a quad Mesh and a MeshRenderer Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a quad Mesh.
        */
        GameObject.CreateQuad = function () {
            var quadObject = new GameObject();
            quadObject.Name = "Quad";

            var meshRenderer = new Vapor.MeshRenderer();
            meshRenderer.mesh = Vapor.Mesh.CreateQuad();
            quadObject.AddComponent(meshRenderer);

            return quadObject;
        };

        /**
        * Creates a GameObject with a line Mesh and a MeshRenderer Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a line Mesh.
        */
        GameObject.CreateLine = function (points, width) {
            if (typeof width === "undefined") { width = 0.1; }
            var lineObject = new GameObject();
            lineObject.Name = "Line";

            var meshRenderer = new Vapor.MeshRenderer();
            meshRenderer.mesh = Vapor.Mesh.CreateLine(points, width);
            lineObject.AddComponent(meshRenderer);

            return lineObject;
        };

        /**
        * Creates a GameObject with a circle Mesh and a MeshRenderer Behavior already attached.
        * @returns {Vapor.GameObject} A new GameObject with a quad Mesh.
        */
        GameObject.CreateCircle = function (radius, segments, startAngle, angularSize) {
            if (typeof radius === "undefined") { radius = 1.0; }
            if (typeof segments === "undefined") { segments = 15; }
            if (typeof startAngle === "undefined") { startAngle = 0.0; }
            if (typeof angularSize === "undefined") { angularSize = Math.PI * 2.0; }
            var circleObject = new GameObject();
            circleObject.Name = "Circle";

            var meshRenderer = new Vapor.MeshRenderer();
            meshRenderer.mesh = Vapor.Mesh.CreateCircle(radius, segments, startAngle, angularSize);
            circleObject.AddComponent(meshRenderer);

            return circleObject;
        };
        return GameObject;
    })(Vapor.VaporObject);
    Vapor.GameObject = GameObject;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    /**
    * A Scene is essentially a list of GameObjects.  It updates and renders all GameObjects
    * as well as holds a reference to a Canvas to render to.
    * @class Represents a Scene
    * @param {Vapor.Canvas} [canvas] The Canvas to use.  If not given, it creates its own.
    */
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene(canvas, gravity) {
            if (typeof canvas === "undefined") { canvas = new Vapor.Canvas(); }
            if (typeof gravity === "undefined") { gravity = new Vapor.Vector2(0.0, -9.8); }
            _super.call(this, "Scene");
            /**
            * The list of GameObjects in the Scene.
            */
            this.gameObjects = new Array();
            /**
            * The list of Camera Components in the Scene. (Don't add to this list!
            * Add the GameObject containing the Camera to Scene.gameObjects.)
            */
            this.cameras = new Array();
            /**
            * True if the game is paused.
            */
            this.paused = false;

            this.canvas = canvas;
            this.gravity = gravity;

            this.world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(gravity.X, gravity.Y), true);

            // Tell the browser to call the Update method
            window.requestAnimationFrame(this.Update.bind(this));

            // Hook the browser resize event and react accordingly
            window.onresize = this.WindowResized.bind(this);

            // We need to initialize values on input classes
            Vapor.Keyboard.Initialize();
            Vapor.Mouse.Initialize();
            Vapor.TouchInput.Initialize();
        }
        Object.defineProperty(Scene.prototype, "Camera", {
            /**
            * Gets the first camera in the scene.
            */
            get: function () {
                return this.cameras[0];
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Adds the given GameObject to the Scene.
        * @param {Vapor.GameObject} gameObject The GameObject to add.
        */
        Scene.prototype.AddGameObject = function (gameObject) {
            gameObject.scene = this;

            for (var i = 0; i < gameObject.components.length; i++) {
                // Check if gameObject contains Camera component.  Add to camera list if it does.
                if (gameObject.components[i] instanceof Vapor.Camera) {
                    this.cameras.push(gameObject.components[i]);
                }
                // TODO: Check if gameObject contains Light component.  Add to light list if it does.
            }

            this.gameObjects.push(gameObject);

            gameObject.Start();
        };

        /**
        * Removes the given [GameObject] from the [Scene].
        */
        Scene.prototype.RemoveGameObject = function (gameObject) {
            this.gameObjects.remove(gameObject);
        };

        /**
        * Clears all [GameObject]s out of the [Scene].
        */
        Scene.prototype.Clear = function () {
            this.gameObjects.length = 0;
            this.world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(this.gravity.X, this.gravity.Y), true);
        };

        /**
        * @private
        */
        Scene.prototype.Update = function (time) {
            if (!this.paused) {
                Vapor.Time.Update();

                this.world.Step(1 / 60, 10, 10);
                this.world.ClearForces();

                for (var i = 0; i < this.gameObjects.length; i++) {
                    this.gameObjects[i].Update();
                }

                // Update all of the Input
                Vapor.Keyboard.Update();
                Vapor.Mouse.Update();
                Vapor.TouchInput.Update();

                this.Render();

                // Tell the browser to call the Update method
                window.requestAnimationFrame(this.Update.bind(this));
            }
        };

        /**
        * @private
        */
        Scene.prototype.Render = function () {
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            for (var i = 0; i < this.cameras.length; i++) {
                this.cameras[i].Clear();

                for (var j = 0; j < this.gameObjects.length; j++) {
                    // Set the view & projection matrix on each renderer
                    if (this.gameObjects[j].renderer) {
                        var viewMatrix = Vapor.Matrix.Copy(this.cameras[i].transform.modelMatrix);
                        viewMatrix.Invert();
                        this.gameObjects[j].renderer.material.SetMatrix("uViewMatrix", viewMatrix);
                        this.gameObjects[j].renderer.material.SetMatrix("uProjectionMatrix", this.cameras[i].projectionMatrix);
                    }

                    this.gameObjects[j].Render();
                }
            }
        };

        /**
        * @private
        */
        Scene.prototype.WindowResized = function (event) {
            console.log("Scene - Window Resized");

            this.canvas.Resize();

            for (var i = 0; i < this.cameras.length; i++) {
                this.cameras[i].OnWindowResized(event);
            }
        };
        return Scene;
    })(Vapor.VaporObject);
    Vapor.Scene = Scene;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    /**
    * A Camera is what renders the GameObjects in the Scene.
    * @class Represents a Camera
    */
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera() {
            _super.call(this, "Camera");
            /**
            * The Color to clear the background to.  Defaults to UnityBlue.
            */
            this.backgroundColor = Vapor.Color.UnityBlue;
            /**
            * The angle, in degrees, of the field of view of the Camera.  Defaults to 45.
            */
            this.fieldOfView = 45.0;
            /**
            * The distance to the near clipping plane of the Camera.  Defaults to 0.1.
            */
            this.nearClipPlane = 0.1;
            /**
            * The distance to the far clipping plane of the Camera.  Defaults to 1000.
            */
            this.farClipPlane = 1000.0;
            /**
            * The current projection Matrix of the Camera.
            */
            this.projectionMatrix = new Vapor.Matrix();

            // NOTE: Can NOT do anything with Transform in the constructor, since
            //       it is not yet attached to a GameObject with a Transform.
            //       Must do it in Awake...
            this.aspect = gl.canvas.width / gl.canvas.height;
            this.projectionMatrix.SetPerspectiveMatrix(Vapor.MathHelper.ToRadians(this.fieldOfView), this.aspect, this.nearClipPlane, this.farClipPlane);
        }
        /**
        * @private
        */
        Camera.prototype.Awake = function () {
            // initialize the view matrix
            this.transform.position = new Vapor.Vector3(0.0, 0.0, -10.0);
            this.transform.LookAt(new Vapor.Vector3(0.0, 0.0, 0.0), new Vapor.Vector3(0.0, 1.0, 0.0));
        };

        /**
        * @private
        */
        Camera.prototype.Update = function () {
            //var position = this.transform.position;
            //if (Keyboard.GetKey(KeyCode.W))
            //    position.Z += 1;
            //if (Keyboard.GetKey(KeyCode.S))
            //    position.Z -= 1;
            //if (Keyboard.GetKey(KeyCode.A))
            //    position.X += 1;
            //if (Keyboard.GetKey(KeyCode.D))
            //    position.X -= 1;
            //this.transform.position = position;
            //if (Vapor.Input.touchCount == 3)
            //    alert("3 touches");
            //if (Vapor.Input.touchCount != 0)
            //    alert(Vapor.Input.touchCount + " touches");
        };

        /**
        * @private
        * Clears the depth and color buffer.
        */
        Camera.prototype.Clear = function () {
            gl.clearColor(this.backgroundColor.X, this.backgroundColor.Y, this.backgroundColor.Z, this.backgroundColor.W);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        };

        /**
        * @private
        * Resets the projection matrix based on the window size.
        */
        Camera.prototype.OnWindowResized = function (event) {
            this.aspect = gl.canvas.width / gl.canvas.height;
            this.projectionMatrix.SetPerspectiveMatrix(Vapor.MathHelper.ToRadians(this.fieldOfView), this.aspect, this.nearClipPlane, this.farClipPlane);
        };

        Camera.prototype.ScreenToWorld = function (screenPoint, z) {
            //Vector3 screenSpace = new Vector3.copy(screenPoint);
            //screenSpace.x /= window.innerWidth;
            //screenSpace.y /= window.innerHeight;
            if (typeof z === "undefined") { z = 0.0; }
            //screenSpace.x = screenSpace.x * 2 - 1;
            //screenSpace.y = screenSpace.y * 2 - 1;
            //screenSpace.y = -screenSpace.y;
            //Matrix4 inverseProjection = new Matrix4.identity();
            //inverseProjection.copyInverse(projectionMatrix);
            //screenSpace = inverseProjection * screenSpace;
            //screenSpace = transform.modelMatrix * screenSpace;
            var pickWorld = new Vapor.Vector3();
            Vapor.Matrix.Unproject(Vapor.Matrix.Multiply(this.projectionMatrix, this.transform.modelMatrix), 0.0, window.innerWidth, 0.0, window.innerHeight, screenPoint.X, screenPoint.Y, z, pickWorld);

            //if (!unproject(projectionMatrix * transform.modelMatrix,
            //               0.0, window.innerWidth,
            //               0.0, window.innerHeight,
            //               screenPoint.x, screenPoint.y, z,
            //               pickWorld))
            //console.log("Unproject failed!");
            // reverse the y value
            pickWorld.Y = -pickWorld.Y;

            return pickWorld;
        };

        Camera.prototype.WorldToScreen = function (worldPoint) {
            var screenPoint = Vapor.Vector3.Copy(worldPoint);
            screenPoint.ApplyProjection(Vapor.Matrix.Multiply(this.projectionMatrix, this.transform.modelMatrix));

            // Now:
            // (-1, 1)  (1, 1)
            // (-1, -1) (1, -1)
            // Convert to:
            // (0, 0)           (pixelWidth, 0)
            // (0, pixelHeight) (pixelWidth, pixelHeight)
            // convert from [-1,1] to [0,1]
            screenPoint.X = (screenPoint.X + 1.0) * 0.5;
            screenPoint.Y = (-screenPoint.Y + 1.0) * 0.5; //y needs to be reversed

            // convert [0,1] to [0,pixelWidth/pixelHeight]
            screenPoint.X *= window.innerWidth;
            screenPoint.Y *= window.innerHeight;

            //console.log(screenPoint.toString());
            return screenPoint;
        };
        return Camera;
    })(Vapor.Component);
    Vapor.Camera = Camera;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    var Canvas = (function () {
        /**
        * Creates a new instance of a Canvas.
        * @constructor
        * @param {HTMLCanvasElement} [canvasElement] - The existing HTML Canvas Element to use.  If not provided, a new Canvas will be created and appended to the document.
        */
        function Canvas(canvasElement) {
            // if an existing canvas element was passed in, use it, otherwise create a new one
            if (canvasElement) {
                this.element = canvasElement;
            } else {
                this.element = document.createElement("canvas");
                this.element.id = "VaporCanvas";
                this.element.width = window.innerWidth;
                this.element.height = window.innerHeight;

                //element.style.zIndex = "0";
                this.element.tabIndex = 0;
                this.element.focus();

                document.body.appendChild(this.element);
            }

            try  {
                gl = this.element.getContext("webgl");
                if (gl == null) {
                    console.log("Using experimental context.");
                    gl = this.element.getContext("experimental-webgl");
                }

                //gl.viewportWidth = element.width;
                //gl.viewportHeight = element.height;
                gl.viewport(0, 0, this.element.width, this.element.height);
            } catch (e) {
                console.error("Exception caught. " + e);
            }

            if (gl == null) {
                window.alert("Unable to initialize WebGL.");
            }
        }
        /**
        *  Resizes the canvas based upon the current browser window size.
        */
        Canvas.prototype.Resize = function () {
            //console.log("Resized. " + window.innerWidth.toString() + "x" + window.innerHeight.toString());
            this.element.width = window.innerWidth;
            this.element.height = window.innerHeight;

            gl.viewport(0, 0, this.element.width, this.element.height);
        };
        return Canvas;
    })();
    Vapor.Canvas = Canvas;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    /**
    * Represents an instance of a Shader, with variables to set.
    * @class Represents a Material
    * @param {Vapor.Shader} shader The backing shader that this Material uses.
    */
    var Material = (function (_super) {
        __extends(Material, _super);
        function Material(shader) {
            _super.call(this, "Material");
            //??? textures = [];
            this.textureCount = 0;
            // TODO: Switch to Map objects once more browsers support them by default.  Chrome needs to have a flag enabled.
            /**
            * A cache of variable locations in the shader to optimize rendering.
            */
            //private cache: Map<String, WebGLUniformLocation>;
            this.cache = {};
            /**
            * A map of texture indices.
            */
            //private textureIndices: Map<String, number>;
            this.textureIndices = {};

            this.shader = shader;
            this.textureCount = 0;

            //this.cache = new Map<String, WebGLUniformLocation>();
            //this.textureIndices = new Map<String, number>();
            this.Use();
        }
        //    Material.Copy(Material other)
        //    {
        //        this.shader = other.shader;
        //        this.textureCount = other.textureCount;
        //        this._cache = new Map.from(other._cache);
        //        this.Use();
        //    }
        /**
        * Sets up WebGL to use this Material (and backing Shader).
        */
        Material.prototype.Use = function () {
            this.shader.Use();
        };

        /**
        * Sets up OpenGL to use this Material (and backing Shader) and sets up
        * the required vertex attributes (position, normal, tex coord, etc).
        */
        Material.prototype.Enable = function () {
            this.shader.Use();

            gl.enableVertexAttribArray(this.shader.vertexPositionAttribute);

            if (this.shader.usesTexCoords)
                gl.enableVertexAttribArray(this.shader.textureCoordAttribute);

            if (this.shader.usesNormals)
                gl.enableVertexAttribArray(this.shader.vertexNormalAttribute);
        };

        /**
        * Disables the vertex attributes (position, normal, tex coord, etc).
        */
        Material.prototype.Disable = function () {
            this.shader.Use();

            gl.disableVertexAttribArray(this.shader.vertexPositionAttribute);

            if (this.shader.usesTexCoords)
                gl.disableVertexAttribArray(this.shader.textureCoordAttribute);

            if (this.shader.usesNormals)
                gl.disableVertexAttribArray(this.shader.vertexNormalAttribute);
        };

        /**
        * Sets the matrix of the given name on this Material.
        * @param {string} name The name of the matrix variable to set.
        * @param {mat4} matrix The matrix value to set the variable to.
        */
        Material.prototype.SetMatrix = function (name, matrix) {
            if (matrix == null) {
                console.log("Matrix is undefined! (" + name + ")");
                return;
            }

            this.Use();

            // cache the location of the variable for faster access
            if (!this.cache[name])
                this.cache[name] = gl.getUniformLocation(this.shader.program, name);

            // (location, transpose, value)
            gl.uniformMatrix4fv(this.cache[name], false, matrix.data);
        };

        /**
        * Sets the vector of the given name on this Material.
        * @param {string} name The name of the vector variable to set.
        * @param {Vector4} vector The vector value to set the variable to.
        */
        Material.prototype.SetVector = function (name, vector) {
            if (vector == null) {
                console.log("Vector is undefined! (" + name + ")");
                return;
            }

            this.Use();

            // cache the location of the variable for faster access
            if (!this.cache[name])
                this.cache[name] = gl.getUniformLocation(this.shader.program, name);

            // (location, value)
            gl.uniform4fv(this.cache[name], vector.data);
        };

        /**
        * Sets the texture of the given name on this Material.
        * @param {String} name The name of the texture variable to set.
        * @param {Texture2D} texture The texture value to set the variable to.
        */
        Material.prototype.SetTexture = function (name, texture) {
            if (texture == null) {
                console.log("Texture is undefined! (" + name + ")");
                return;
            }

            this.Use();

            // cache the location of the variable for faster access
            if (!this.cache[name]) {
                if (this.textureCount >= 31) {
                    console.log("The maximum number of textures (32) is already bound!");
                    return;
                }
                this.cache[name] = gl.getUniformLocation(this.shader.program, name);
                this.textureIndices[name] = this.textureCount;
                this.textureCount++;
            }

            // Does this need to be done each draw? - No, it shouldn't have to be.
            gl.activeTexture(this.TextureIndex(this.textureIndices[name]));
            gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, texture.glTexture);
            gl.uniform1i(this.cache[name], this.textureIndices[name]);
            // TODO: Unbind texture?
        };

        /**
        * Converts a normal int index into a WebGL.Texture# int index.
        */
        Material.prototype.TextureIndex = function (index) {
            return WebGLRenderingContext.TEXTURE0 + index;
        };
        return Material;
    })(Vapor.VaporObject);
    Vapor.Material = Material;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    /**
    * Represents a 3D model that is rendered.
    * @class Represents a Mesh
    */
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh() {
            _super.apply(this, arguments);
            this.vertexBuffer = null;
            this.vertexCount = 0;
            this.uvBuffer = null;
            this.normalBuffer = null;
            this.indexBuffer = null;
            this.indexCount = 0;
        }
        Object.defineProperty(Mesh.prototype, "Vertices", {
            /**
            * Gets and sets the vertices making up this Mesh.
            * @name Vapor.Mesh.prototype.vertices
            * @property
            */
            get: function () {
                return this.vertices;
            },
            set: function (newVertices) {
                // create vertex position buffer
                this.vertices = newVertices;
                gl.deleteBuffer(this.vertexBuffer);
                this.vertexBuffer = gl.createBuffer();
                gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, this.vertexBuffer);
                gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, this.vertices, WebGLRenderingContext.STATIC_DRAW);

                //this.vertexBuffer.stride = 3; // 3 floats per vertex position
                this.vertexCount = this.vertices.length / 3;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Mesh.prototype, "UV", {
            /**
            * Gets and sets the texture coodinates for each vertex making up this Mesh.
            * @name Vapor.Mesh.prototype.uv
            * @property
            */
            get: function () {
                return this.uv;
            },
            set: function (newUVs) {
                // create texture coordinate buffer
                this.uv = newUVs;
                gl.deleteBuffer(this.uvBuffer);
                this.uvBuffer = gl.createBuffer();
                gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, this.uvBuffer);
                gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, this.uv, WebGLRenderingContext.STATIC_DRAW);
                //this.uvBuffer.stride = 2; // 2 floats per vertex position
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Mesh.prototype, "Normals", {
            /**
            * Gets and sets the normal vectors for each vertex making up this Mesh.
            * @name Vapor.Mesh.prototype.normals
            * @property
            */
            get: function () {
                return this.normals;
            },
            set: function (newNormals) {
                // create normal vector buffer
                this.normals = newNormals;
                gl.deleteBuffer(this.normalBuffer);
                this.normalBuffer = gl.createBuffer();
                gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, this.normalBuffer);
                gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, this.normals, WebGLRenderingContext.STATIC_DRAW);
                //this.normalBuffer.stride = 3; // 3 floats per vertex position
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Mesh.prototype, "Triangles", {
            /**
            * Gets and sets the index buffer of this Mesh. This defines which vertices make up what triangles.
            * @name Vapor.Mesh.prototype.triangles
            * @property
            */
            get: function () {
                return this.triangles;
            },
            set: function (newTriangles) {
                // create index buffer
                this.triangles = newTriangles;
                gl.deleteBuffer(this.indexBuffer);
                this.indexBuffer = gl.createBuffer();
                gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                gl.bufferData(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, this.triangles, WebGLRenderingContext.STATIC_DRAW);
                this.indexCount = this.triangles.length;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Draws the mesh using the given Material
        * @param {Vapor.Material} material The Material to use to render the mesh.
        */
        Mesh.prototype.Render = function (material) {
            material.Enable();

            gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, this.vertexBuffer);
            gl.vertexAttribPointer(material.shader.vertexPositionAttribute, 3, WebGLRenderingContext.FLOAT, false, 0, 0);

            if (material.shader.usesTexCoords) {
                if (this.uvBuffer != null) {
                    //console.log("Setting tex coords");
                    gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, this.uvBuffer);
                    gl.vertexAttribPointer(material.shader.textureCoordAttribute, 2, WebGLRenderingContext.FLOAT, false, 0, 0);
                } else
                    console.log("Shader (" + material.shader.filepath + ") expects texure coords, but the mesh (" + this.Name + ") doesn't have them.");
            }

            //else
            //{
            //    // disable tex coord attribute
            //    // TODO: determine the actual attribute index
            //    gl.disableVertexAttribArray(1);
            //}
            if (material.shader.usesNormals) {
                if (this.normalBuffer != null) {
                    //console.log("Setting normals");
                    gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, this.normalBuffer);
                    gl.vertexAttribPointer(material.shader.vertexNormalAttribute, 3, WebGLRenderingContext.FLOAT, false, 0, 0);
                } else
                    console.log("Shader (" + material.shader.filepath + ") expects normals, but the mesh (" + this.Name + ") doesn't have them.");
            }

            gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.drawElements(WebGLRenderingContext.TRIANGLES, this.indexCount, WebGLRenderingContext.UNSIGNED_SHORT, 0);

            material.Disable();
        };

        // ----  Creation Methods
        /**
        * Creates a new Mesh containing data for a triangle.
        * @returns {Vapor.Mesh} The new Mesh representing a triangle.
        */
        Mesh.CreateTriangle = function () {
            //    0
            //   / \
            //  /   \
            // 1-----2
            var mesh = new Mesh();
            mesh.Name = "Triangle";

            mesh.Vertices = new Float32Array([
                0.0, 0.5, 0.0,
                -0.5, -0.5, 0.0,
                0.5, -0.5, 0.0]);

            mesh.UV = new Float32Array([
                0.5, 1.0,
                0.0, 0.0,
                1.0, 0.0]);

            mesh.Normals = new Float32Array([
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0]);

            mesh.Triangles = new Uint16Array([0, 1, 2]);

            return mesh;
        };

        /**
        * Creates a new Mesh containing data for a quad.
        * @returns {Vapor.Mesh} The new Mesh representing a quad.
        */
        Mesh.CreateQuad = function () {
            // 1--0
            // |\ |
            // | \|
            // 3--2
            var mesh = new Mesh();
            mesh.Name = "Quad";

            mesh.Vertices = new Float32Array([
                0.5, 0.5, 0.0,
                -0.5, 0.5, 0.0,
                0.5, -0.5, 0.0,
                -0.5, -0.5, 0.0]);

            mesh.UV = new Float32Array([
                1.0, 1.0,
                0.0, 1.0,
                1.0, 0.0,
                0.0, 0.0]);

            mesh.Normals = new Float32Array([
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0]);

            mesh.Triangles = new Uint16Array([0, 1, 2, 1, 3, 2]);

            return mesh;
        };

        /**
        * Creates a new Mesh containing data for a line.
        * @returns {Vapor.Mesh} The new Mesh representing a line.
        */
        Mesh.CreateLine = function (points, width) {
            // 1-3-5
            // |/|/|
            // 0-2-4
            if (typeof width === "undefined") { width = 0.1; }
            // 0-2-4
            // |/|/|
            // 1-3-5
            var mesh = new Mesh();
            mesh.Name = "Line";

            var halfWidth = width / 2.0;

            var vertices = new Array();
            var triangles = new Array();

            for (var i = 0; i < points.length; i++) {
                // TODO: calculate the vector perpendicular to the direction of the line for width
                vertices.add(points[i].X);
                vertices.add(points[i].Y + halfWidth);
                vertices.add(points[i].Z);

                vertices.add(points[i].X);
                vertices.add(points[i].Y - halfWidth);
                vertices.add(points[i].Z);
            }

            mesh.Vertices = new Float32Array(vertices);

            for (var i = 0; i < points.length; i += 2) {
                triangles.add(i);
                triangles.add(i + 1);
                triangles.add(i + 2);

                triangles.add(i + 1);
                triangles.add(i + 3);
                triangles.add(i + 2);
            }

            //mesh.triangles = new Uint16List.fromList([0, 1, 2, 1, 3, 2]);
            mesh.Triangles = new Uint16Array(triangles);

            //[0, 1, 2,
            // 1, 3, 2]);
            //2, 3, 4,
            //3, 5, 4]);
            return mesh;
        };

        /**
        * Creates a Mesh with vertices forming a 2D circle.
        * radius - Radius of the circle. Value should be greater than or equal to 0.0. Defaults to 1.0.
        * segments - The number of segments making up the circle. Value should be greater than or equal to 3. Defaults to 15.
        * startAngle - The starting angle of the circle.  Defaults to 0.
        * angularSize - The angular size of the circle.  2 pi is a full circle. Pi is a half circle. Defaults to 2 pi.
        */
        Mesh.CreateCircle = function (radius, segments, startAngle, angularSize) {
            if (typeof radius === "undefined") { radius = 1.0; }
            if (typeof segments === "undefined") { segments = 15; }
            if (typeof startAngle === "undefined") { startAngle = 0.0; }
            if (typeof angularSize === "undefined") { angularSize = Math.PI * 2.0; }
            var mesh = new Mesh();
            mesh.Name = "Circle";

            var uvs = new Array();
            var vertices = new Array();
            var triangles = new Array();

            vertices.add(new Vapor.Vector3());
            uvs.add(new Vapor.Vector2(0.5, 0.5));

            var stepAngle = angularSize / segments;

            for (var i = 0; i <= segments; i++) {
                var vertex = new Vapor.Vector3();
                var angle = startAngle + stepAngle * i;

                //window.console.log(string.Format("{0}: {1}", i, angle));
                vertex.X = radius * Math.cos(angle);
                vertex.Y = radius * Math.sin(angle);

                vertices.add(vertex);
                uvs.add(new Vapor.Vector2((vertex.X / radius + 1) / 2, (vertex.Y / radius + 1) / 2));
            }

            for (var i = 1; i <= segments; i++) {
                triangles.add(i + 1);
                triangles.add(i);
                triangles.add(0);
            }

            mesh.Vertices = this.CreateFloat32List3(vertices);

            //mesh.normals = normals;
            mesh.UV = this.CreateFloat32List2(uvs);
            mesh.Triangles = new Uint16Array(triangles);

            return mesh;
        };

        /**
        * Convert a list of Vector3 objects into a Float32List object
        */
        Mesh.CreateFloat32List3 = function (vectorList) {
            var list = new Float32Array(vectorList.length * 3);

            var index = 0;
            for (var i = 0; i < vectorList.length; i++) {
                list[index++] = vectorList[i].X;
                list[index++] = vectorList[i].Y;
                list[index++] = vectorList[i].Z;
            }

            return list;
        };

        /**
        * Convert a list of Vector2 objects into a Float32List object
        */
        Mesh.CreateFloat32List2 = function (vectorList) {
            var list = new Float32Array(vectorList.length * 2);

            var index = 0;
            for (var i = 0; i < vectorList.length; i++) {
                list[index++] = vectorList[i].X;
                list[index++] = vectorList[i].Y;
            }

            return list;
        };
        return Mesh;
    })(Vapor.VaporObject);
    Vapor.Mesh = Mesh;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    /**
    * The base behavior that is used to render anything.
    * @class Represents a Renderer
    * @see Vapor.Behavior
    */
    var Renderer = (function (_super) {
        __extends(Renderer, _super);
        function Renderer() {
            _super.apply(this, arguments);
            /**
            * The Vapor.Material that this Renderer uses.
            * @type Vapor.Material
            */
            this.material = null;
        }
        /**
        * @private
        */
        Renderer.prototype.Update = function () {
            //console.log("Renderer Update");
        };

        /**
        * @private
        */
        Renderer.prototype.Render = function () {
            //console.log("Renderer Draw");
        };
        return Renderer;
    })(Vapor.Component);
    Vapor.Renderer = Renderer;
})(Vapor || (Vapor = {}));
/// <reference path="Renderer.ts" />
var Vapor;
(function (Vapor) {
    /**
    * Represents a Renderer behavior that is used to render a mesh.
    * @class Represents a MeshRenderer
    */
    var MeshRenderer = (function (_super) {
        __extends(MeshRenderer, _super);
        function MeshRenderer() {
            _super.apply(this, arguments);
            /**
            * The mesh that this MeshRenderer will draw.
            */
            this.mesh = null;
        }
        /**
        * @private
        */
        MeshRenderer.prototype.Render = function () {
            //console.log("MeshRenderer Draw");
            this.material.Use();

            //this.material.SetMatrix("uModelViewMatrix", this.gameObject.transform.modelMatrix);
            this.material.SetMatrix("uModelMatrix", this.gameObject.transform.ScaledModelMatrix);
            this.mesh.Render(this.material);
        };
        return MeshRenderer;
    })(Vapor.Renderer);
    Vapor.MeshRenderer = MeshRenderer;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    /**
    * Represents a shader program.
    * @class Represents a Shader
    */
    var Shader = (function () {
        function Shader() {
            this.vertexShader = null;
            this.pixelShader = null;
            this.program = null;
            // the filepath to the shader, if it was loaded from a file
            this.filepath = "";
            this.usesTexCoords = false;
            this.usesNormals = false;
        }
        //    Shader.Copy(Shader other)
        //    {
        //
        //    }
        /**
        * Sets up WebGL to use this Shader.
        */
        Shader.prototype.Use = function () {
            gl.useProgram(this.program);
        };

        /**
        * Loads a shader from the given file path.
        * @param {string} filepath The filepath of the shader to load.
        * @returns {Vapor.Shader} The newly created Shader.
        */
        Shader.FromFile = function (filepath, callback) {
            console.log("Loading shader = " + filepath.substring(filepath.lastIndexOf("/") + 1));

            Vapor.FileDownloader.Download(filepath, function (request) {
                var shader = Shader.FromSource(request.responseText, filepath);
                shader.filepath = filepath;
                callback(shader);
            });
        };

        /**
        * Loads a shader from a script tag with the given ID.
        * @param {string} shaderScriptID The ID of the script tag to load as a Shader.
        * @returns {Vapor.Shader} The newly created Shader.
        */
        Shader.FromScript = function (shaderScriptID) {
            var shaderSource = Shader.LoadShaderSourceFromScript(shaderScriptID);
            return Shader.FromSource(shaderSource, null);
        };

        /**
        * Loads a shader from the given source code (text).
        * @param {string} shaderSource The full source (text) of the shader.
        * @param {string} [filepath] The current filepath to work from. (Used for including other shader code.)
        * @returns {Vapor.Shader} The newly created Shader.
        */
        Shader.FromSource = function (shaderSource, filepath) {
            var shader = new Shader();

            shaderSource = Shader.PreprocessSource(shaderSource, filepath);

            shader.vertexShader = Shader.CompileShader(0 /* VertexShader */, shaderSource);
            shader.pixelShader = Shader.CompileShader(1 /* FragmentShader */, shaderSource);

            shader.program = gl.createProgram();
            gl.attachShader(shader.program, shader.vertexShader);
            gl.attachShader(shader.program, shader.pixelShader);
            gl.linkProgram(shader.program);

            if (!gl.getProgramParameter(shader.program, WebGLRenderingContext.LINK_STATUS)) {
                console.log("Link error! Could not initialise shaders.");
            }

            // setup the default attributes
            shader.vertexPositionAttribute = gl.getAttribLocation(shader.program, "aVertexPosition");

            //console.log("Vertex Position attrib = " + shader.vertexPositionAttribute);
            shader.textureCoordAttribute = gl.getAttribLocation(shader.program, "aTextureCoord");
            if (shader.textureCoordAttribute != -1) {
                //console.log("Uses Tex coords! - " + this.filepath);
                shader.usesTexCoords = true;
            }

            shader.vertexNormalAttribute = gl.getAttribLocation(shader.program, "aVertexNormal");
            if (shader.vertexNormalAttribute != -1) {
                //console.log("Uses Normals! - " + this.filepath);
                shader.usesNormals = true;
            }

            return shader;
        };

        /**
        @private
        */
        Shader.LoadShaderSourceFromScript = function (shaderScriptID) {
            var shaderScript = document.getElementById(shaderScriptID);
            if (shaderScript == null) {
                return null;
            }

            var shaderSource = "";
            var k = shaderScript.firstChild;
            while (k != null) {
                if (k.nodeType == 3) {
                    shaderSource += k.textContent;
                }
                k = k.nextSibling;
            }

            return shaderSource;
        };

        /**
        * @private
        * Process the shader source and pull in the include code
        */
        //private static PreprocessSource(shaderSource: string, filepath: string, callback: (sourceCode: string) => any): string {
        Shader.PreprocessSource = function (shaderSource, filepath) {
            console.log("Preprocessing shader source...");

            var relativePath = filepath.substring(0, filepath.lastIndexOf("/") + 1);

            // \s* = any whitespace before the #include (0 or more spaces)
            // #include = #include
            // \s+ = any whitespace after the #include, but before the first quotation mark (1 or more spaces)
            // \" = first quotation mark
            // .+  = any non-whitespace characters (1 or more)
            // \" = second quotation mark
            var findIncludes = new RegExp('\\s*#include\\s+\\".+\\"');

            //var matches = findIncludes.allMatches(shaderSource);
            var matches = findIncludes.exec(shaderSource);

            if (matches) {
                //console.log("Found matches = " + matches.length.toString());
                var stripIncludes = new RegExp('\\s*#include\\s+\\"', "g");
                var stripEnd = new RegExp('\\"', "g");

                for (var i = 0; i < matches.length; i++) {
                    //console.log("Match = " + matches[i]);
                    var includeFile = matches[i].replace(stripIncludes, "");
                    includeFile = includeFile.replace(stripEnd, "");

                    console.log("Including shader = " + includeFile);

                    var request = Vapor.FileDownloader.DownloadSynchronous(relativePath + includeFile);

                    shaderSource = shaderSource.replace(matches[i], request.responseText + "\n");
                    //FileDownloader.Download(relativePath + includeFile, (request: XMLHttpRequest) => {
                    //    shaderSource = shaderSource.replace(matches[i], request.response + "\n");
                    //});
                }
            }

            return shaderSource;
        };

        /**
        @private
        */
        Shader.CompileShader = function (shaderType, source) {
            var preprocessor = shaderType == 0 /* VertexShader */ ? Shader.vertexShaderPreprocessor : Shader.pixelShaderPreprocessor;

            //console.log("Compiling " + preprocessor);
            var type = WebGLRenderingContext.VERTEX_SHADER;
            if (shaderType == 1 /* FragmentShader */)
                type = WebGLRenderingContext.FRAGMENT_SHADER;

            var shaderObject = gl.createShader(type);
            source = '#define ' + preprocessor + '\n' + source;

            gl.shaderSource(shaderObject, source);
            gl.compileShader(shaderObject);

            if (!gl.getShaderParameter(shaderObject, WebGLRenderingContext.COMPILE_STATUS)) {
                console.log("Shader compilation error: " + preprocessor + " - " + gl.getShaderInfoLog(shaderObject));
            }

            return shaderObject;
        };
        Shader.vertexShaderPreprocessor = "VERTEX_SHADER";
        Shader.pixelShaderPreprocessor = "FRAGMENT_SHADER";
        return Shader;
    })();
    Vapor.Shader = Shader;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    /**
    * An enumeration of the different types of shader.
    */
    (function (ShaderType) {
        /**
        * The type for a Vertex Shader
        */
        ShaderType[ShaderType["VertexShader"] = 0] = "VertexShader";

        /**
        * The type for a Fragment (Pixel) Shader
        */
        ShaderType[ShaderType["FragmentShader"] = 1] = "FragmentShader";
    })(Vapor.ShaderType || (Vapor.ShaderType = {}));
    var ShaderType = Vapor.ShaderType;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    var Texture2D = (function (_super) {
        __extends(Texture2D, _super);
        function Texture2D(texturePath) {
            _super.call(this, "Texture2D");
            /**
            * The actual HTML image element.
            */
            this.image = new HTMLImageElement();

            this.image.crossOrigin = "anonymous"; //???
            this.image.onload = this.Loaded.bind(this);
            this.image.src = texturePath;

            this.glTexture = gl.createTexture();
        }
        Texture2D.prototype.Loaded = function (e) {
            console.log("Texture loaded.");

            // bind the texture and set parameters for it
            gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.glTexture);
            gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, this.image);
            gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, WebGLRenderingContext.LINEAR);
            gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.LINEAR);

            // unbind the texture
            gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, null);

            if (this.LoadedCallback)
                this.LoadedCallback(this);
        };
        return Texture2D;
    })(Vapor.VaporObject);
    Vapor.Texture2D = Texture2D;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    var Keyboard = (function () {
        function Keyboard() {
        }
        Keyboard.Initialize = function () {
            document.onkeydown = Keyboard.KeyDown;
            document.onkeyup = Keyboard.KeyUp;
        };

        Keyboard.KeyDown = function (event) {
            //console.log(event.keyCode.toString() + " was pressed.");
            Keyboard.nextFrame[event.keyCode] = true;
        };

        Keyboard.KeyUp = function (event) {
            //console.log(event.keyCode.toString() + " was released.");
            Keyboard.nextFrame[event.keyCode] = false;
        };

        /**
        * @private
        * Internal method to update the keyboard frame data (only used in Vapor.Game.Scene).
        */
        Keyboard.Update = function () {
            Keyboard.previousFrame = JSON.parse(JSON.stringify(Keyboard.currentFrame));
            Keyboard.currentFrame = JSON.parse(JSON.stringify(Keyboard.nextFrame));
        };

        /**
        * Gets the state for the given key code.
        * Returns true for every frame that the key is down, like autofire.
        * @param {Vapor.Input.KeyCode} keyCode The key code to check.
        * @returns {boolean} True if the key is currently down, otherwise false.
        */
        Keyboard.GetKey = function (keyCode) {
            return Keyboard.currentFrame[keyCode] && Keyboard.currentFrame[keyCode];
        };

        /**
        * Returns true during the frame the user pressed the given key.
        * @param {Vapor.Input.KeyCode} keyCode The key code to check.
        * @returns {boolean} True if the key was pressed this frame, otherwise false.
        */
        Keyboard.GetKeyDown = function (keyCode) {
            return Keyboard.currentFrame[keyCode] && Keyboard.currentFrame[keyCode] && (!Keyboard.previousFrame[keyCode] || !Keyboard.previousFrame[keyCode]);
        };

        /**
        * Returns true during the frame the user released the given key.
        * @param {Vapor.Input.KeyCode} keyCode The key code to check.
        * @returns {boolean} True if the key was released this frame, otherwise false.
        */
        Keyboard.GetKeyUp = function (keyCode) {
            return Keyboard.currentFrame[keyCode] && !Keyboard.currentFrame[keyCode] && Keyboard.previousFrame[keyCode];
        };
        Keyboard.previousFrame = {};
        Keyboard.currentFrame = {};
        Keyboard.nextFrame = {};
        return Keyboard;
    })();
    Vapor.Keyboard = Keyboard;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    /**
    * An enumeration of the different possible keys to press.
    */
    (function (KeyCode) {
        KeyCode[KeyCode["A"] = 65] = "A";
        KeyCode[KeyCode["B"] = 66] = "B";
        KeyCode[KeyCode["C"] = 67] = "C";
        KeyCode[KeyCode["D"] = 68] = "D";
        KeyCode[KeyCode["E"] = 69] = "E";
        KeyCode[KeyCode["F"] = 70] = "F";
        KeyCode[KeyCode["G"] = 71] = "G";
        KeyCode[KeyCode["H"] = 72] = "H";
        KeyCode[KeyCode["I"] = 73] = "I";
        KeyCode[KeyCode["J"] = 74] = "J";
        KeyCode[KeyCode["K"] = 75] = "K";
        KeyCode[KeyCode["L"] = 76] = "L";
        KeyCode[KeyCode["M"] = 77] = "M";
        KeyCode[KeyCode["N"] = 78] = "N";
        KeyCode[KeyCode["O"] = 79] = "O";
        KeyCode[KeyCode["P"] = 80] = "P";
        KeyCode[KeyCode["Q"] = 81] = "Q";
        KeyCode[KeyCode["R"] = 82] = "R";
        KeyCode[KeyCode["S"] = 83] = "S";
        KeyCode[KeyCode["T"] = 84] = "T";
        KeyCode[KeyCode["U"] = 85] = "U";
        KeyCode[KeyCode["V"] = 86] = "V";
        KeyCode[KeyCode["W"] = 87] = "W";
        KeyCode[KeyCode["X"] = 88] = "X";
        KeyCode[KeyCode["Y"] = 89] = "Y";
        KeyCode[KeyCode["Z"] = 90] = "Z";
    })(Vapor.KeyCode || (Vapor.KeyCode = {}));
    var KeyCode = Vapor.KeyCode;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    var Vector3 = (function () {
        /**
        * Creates a new instance of a Vector3 initialized to the given values or [0, 0, 0].
        * @constructor
        */
        function Vector3(x, y, z) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof z === "undefined") { z = 0; }
            this.data = new Float32Array(3);
            this.data[0] = x;
            this.data[1] = y;
            this.data[2] = z;
        }
        Object.defineProperty(Vector3.prototype, "X", {
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vector3.prototype, "Y", {
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vector3.prototype, "Z", {
            get: function () {
                return this.data[2];
            },
            set: function (value) {
                this.data[2] = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vector3.prototype, "XY", {
            get: function () {
                return new Vapor.Vector2(this.data[0], this.data[1]);
            },
            set: function (value) {
                this.data[0] = value.X;
                this.data[1] = value.Y;
            },
            enumerable: true,
            configurable: true
        });

        Vector3.Copy = function (other) {
            var copy = new Vector3();
            copy.data[0] = other.data[0];
            copy.data[1] = other.data[1];
            copy.data[2] = other.data[2];
            return copy;
        };

        /**
        * Adds the given Vector3 to this Vector3
        * @param {Vector3} other - The Vector3 to add to this one
        */
        Vector3.prototype.Add = function (other) {
            this.data[0] += other.data[0];
            this.data[1] += other.data[1];
            this.data[2] += other.data[2];
        };

        /**
        * Adds the given Vector3 objects together and returns the result.
        * @param {Vector3} a - The first Vector3 to add.
        * @param {Vector3} b - The second Vector3 to add.
        * @returns {Vector3} The sum of a and b.
        */
        Vector3.Add = function (a, b) {
            var result = new Vector3();
            result.data[0] = a.data[0] + b.data[0];
            result.data[1] = a.data[1] + b.data[1];
            result.data[2] = a.data[2] + b.data[2];
            return result;
        };

        /**
        * Subtracts the given Vector3 from this Vector3.
        *
        * @param {Vector3} other - The Vector3 to subtract from this one
        */
        Vector3.prototype.Subtract = function (other) {
            this.data[0] -= other.data[0];
            this.data[1] -= other.data[1];
            this.data[2] -= other.data[2];
        };

        /// Projects [this] using the projection matrix [arg]
        Vector3.prototype.ApplyProjection = function (arg) {
            var _x = this.data[0];
            var _y = this.data[1];
            var _z = this.data[2];

            var d = 1.0 / (arg.data[3] * _x + arg.data[7] * _y + arg.data[11] * _z + arg.data[15]);
            this.data[0] = (arg.data[0] * _x + arg.data[4] * _y + arg.data[8] * _z + arg.data[12]) * d;
            this.data[1] = (arg.data[1] * _x + arg.data[5] * _y + arg.data[9] * _z + arg.data[13]) * d;
            this.data[2] = (arg.data[2] * _x + arg.data[6] * _y + arg.data[10] * _z + arg.data[14]) * d;
            return this;
        };
        return Vector3;
    })();
    Vapor.Vector3 = Vector3;
})(Vapor || (Vapor = {}));
/// <reference path="../Math/Vector3.ts" />
var Vapor;
(function (Vapor) {
    var Mouse = (function () {
        function Mouse() {
        }
        Mouse.Initialize = function () {
            document.onmousedown = Mouse.MouseDown;
            document.onmouseup = Mouse.MouseUp;
            document.onmousemove = Mouse.MouseMove;
        };

        Mouse.MouseDown = function (event) {
            //console.log(event.button.toString() + " pressed");
            Mouse.nextFrame[event.button] = true;
        };

        Mouse.MouseUp = function (event) {
            //console.log(event.button.toString() + " released");
            Mouse.nextFrame[event.button] = false;
        };

        Mouse.MouseMove = function (event) {
            //console.log(event.client.toString());
            Mouse.nextMousePosition.X = event.clientX * 1.0;
            Mouse.nextMousePosition.Y = event.clientY * 1.0;

            var screenSpace = Vapor.Vector3.Copy(Mouse.nextMousePosition);
            screenSpace.X /= window.innerWidth;
            screenSpace.Y /= window.innerHeight;

            screenSpace.X = screenSpace.X * 2 - 1;
            screenSpace.Y = screenSpace.Y * 2 - 1;

            screenSpace.Y = -screenSpace.Y;
            //console.log(screenSpace.toString());
        };

        /**
        * @private
        * Internal method to update the mouse frame data (only used in Vapor.Game.Scene).
        */
        Mouse.Update = function () {
            Mouse.deltaMousePosition.X = Mouse.nextMousePosition.X - Mouse.mousePosition.X;
            Mouse.deltaMousePosition.Y = Mouse.nextMousePosition.Y - Mouse.mousePosition.Y;

            Mouse.mousePosition.X = Mouse.nextMousePosition.X;
            Mouse.mousePosition.Y = Mouse.nextMousePosition.Y;

            Mouse.previousFrame = JSON.parse(JSON.stringify(Mouse.currentFrame));
            Mouse.currentFrame = JSON.parse(JSON.stringify(Mouse.nextFrame));
        };

        /**
        * Gets the state for the given mouse button index.
        * Returns true for every frame that the button is down, like autofire.
        * @param {int} button The mouse button index to check. 0 = left, 1 = middle, 2 = right.
        * @returns {boolean} True if the button is currently down, otherwise false.
        */
        Mouse.GetMouseButton = function (button) {
            return Mouse.currentFrame[button] && Mouse.currentFrame[button];
        };

        /**
        * Returns true during the frame the user pressed the given mouse button.
        * @param {int} button The mouse button index to check. 0 = left, 1 = middle, 2 = right.
        * @returns {boolean} True if the button was pressed this frame, otherwise false.
        */
        Mouse.GetMouseButtonDown = function (button) {
            return Mouse.currentFrame[button] && Mouse.currentFrame[button] && (!Mouse.previousFrame[button] || !Mouse.previousFrame[button]);
        };

        /**
        * Returns true during the frame the user releases the given mouse button.
        * @param {int} button The mouse button index to check. 0 = left, 1 = middle, 2 = right.
        * @returns {boolean} True if the button was released this frame, otherwise false.
        */
        Mouse.GetMouseButtonUp = function (button) {
            return Mouse.currentFrame[button] && !Mouse.currentFrame[button] && Mouse.previousFrame[button];
        };
        Mouse.previousFrame = {};
        Mouse.currentFrame = {};
        Mouse.nextFrame = {};

        Mouse.nextMousePosition = new Vapor.Vector3();

        Mouse.mousePosition = new Vapor.Vector3();
        Mouse.deltaMousePosition = new Vapor.Vector3();
        return Mouse;
    })();
    Vapor.Mouse = Mouse;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    var TouchInput = (function () {
        function TouchInput() {
        }
        TouchInput.Initialize = function () {
            document.ontouchstart = TouchInput.TouchStart;
            document.ontouchend = TouchInput.TouchEnd;
            document.ontouchmove = TouchInput.TouchMove;
        };

        // touches: a list of all fingers currently on the screen.
        // changedTouches: a list of fingers involved in the current event. For example, in a touchend event, this will be the finger that was removed.
        // radius coordinates and rotationAngle: describe the ellipse that approximates finger shape.
        TouchInput.TouchStart = function (event) {
            // prevent the mobile defaults (pinch zoom, etc)
            event.preventDefault();

            var changedTouches = event.changedTouches;

            for (var i = 0; i < changedTouches.length; i++) {
                // try to find an existing touch object with the same ID
                var found = false;
                for (var j = 0; j < TouchInput.nextFrame.length; j++) {
                    if (changedTouches[i].identifier == TouchInput.nextFrame[j].fingerId) {
                        found = true;
                        break;
                    }
                }

                // if an existing touch object wasn't found, create a new one
                if (!found) {
                    var newTouch = new Vapor.TouchData();
                    newTouch.fingerId = changedTouches[i].identifier;
                    newTouch.position = new Vapor.Vector3(changedTouches[i].screen.x, changedTouches[i].screen.y, 0.0);

                    //newTouch.deltaPosition = new Point(0.0, 0.0);
                    //newTouch.deltaTime = 0.0;
                    //newTouch.tapCount = 0;
                    //newTouch.phase = TouchPhase.Began;
                    //console.log("Added touch");
                    TouchInput.nextFrame.push(newTouch);
                }
            }
        };

        TouchInput.TouchEnd = function (event) {
            //console.log("Touch End " + event.touches);
            var changedTouches = event.changedTouches;

            for (var i = 0; i < changedTouches.length; i++) {
                var newTouch = changedTouches[i];
                for (var j = 0; j < TouchInput.nextFrame.length; j++) {
                    var oldTouch = TouchInput.nextFrame[j];
                    if (newTouch.identifier == oldTouch.fingerId) {
                        oldTouch.deltaPosition = new Vapor.Vector3(newTouch.screenX - oldTouch.position.X, newTouch.screenY - oldTouch.position.Y, 0.0);
                        oldTouch.position = new Vapor.Vector3(newTouch.screenX, newTouch.screenY, 0.0);
                        oldTouch.deltaTime = Vapor.Time.deltaTime;
                        oldTouch.tapCount = 0;
                        oldTouch.phase = 3 /* Ended */;
                    }
                }
            }
        };

        TouchInput.TouchMove = function (event) {
            //console.log("Touch Move " + event.touches);
            var changedTouches = event.changedTouches;

            for (var i = 0; i < changedTouches.length; i++) {
                var newTouch = changedTouches[i];
                for (var j = 0; j < TouchInput.nextFrame.length; j++) {
                    var oldTouch = TouchInput.nextFrame[j];
                    if (newTouch.identifier == oldTouch.fingerId) {
                        oldTouch.deltaPosition = new Vapor.Vector3(newTouch.screenX - oldTouch.position.X, newTouch.screenY - oldTouch.position.Y, 0.0);
                        oldTouch.position = new Vapor.Vector3(newTouch.screenX, newTouch.screenY, 0.0); //use client instead?
                        oldTouch.deltaTime = Vapor.Time.deltaTime;
                        oldTouch.tapCount = 0;
                        oldTouch.phase = 1 /* Moved */;
                    }
                }
            }
        };

        /**
        * @private
        * Internal method to update the mouse frame data (only used in Vapor.Game.Scene).
        */
        TouchInput.Update = function () {
            TouchInput.previousFrame = TouchInput.currentFrame.clone();
            TouchInput.currentFrame = TouchInput.nextFrame.clone();

            // remove the touches that have ended from the next frame
            if (TouchInput.nextFrame != null) {
                for (var i = TouchInput.nextFrame.length - 1; i >= 0; i--) {
                    if (TouchInput.nextFrame[i].phase == 3 /* Ended */) {
                        TouchInput.nextFrame.removeAt(i);
                    }
                }
            }
        };

        /**
        * Gets the touch object stored at the given index.
        * @param {int} index The index of the touch to get.
        * @returns {Vapor.Input.Touch} The touch object at the given index
        */
        TouchInput.GetTouch = function (index) {
            return TouchInput.currentFrame[index];
        };

        Object.defineProperty(TouchInput, "TouchCount", {
            /**
            * Number of touches. Guaranteed not to change throughout the frame.
            */
            get: function () {
                return TouchInput.currentFrame.length;
            },
            enumerable: true,
            configurable: true
        });
        TouchInput.previousFrame = new Array();
        TouchInput.currentFrame = new Array();
        TouchInput.nextFrame = new Array();
        return TouchInput;
    })();
    Vapor.TouchInput = TouchInput;
})(Vapor || (Vapor = {}));

;

;

;


var Vapor;
(function (Vapor) {
    /**
    * Contains the data for a certain touch.
    */
    var TouchData = (function () {
        function TouchData() {
            /**
            * The unique index for touch.
            */
            this.fingerId = 0;
            /**
            * The position of the touch.
            */
            this.position = new Vapor.Vector3();
            /**
            * The position delta since last change.
            */
            this.deltaPosition = new Vapor.Vector3();
            /**
            * Amount of time passed since last change.
            */
            this.deltaTime = 0.0;
            /**
            * Number of taps.
            */
            this.tapCount = 0;
            /**
            * Describes the phase of the touch.
            */
            this.phase = 0 /* Began */;
        }
        return TouchData;
    })();
    Vapor.TouchData = TouchData;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    /**
    * Enumeration of the possible touch phases.
    */
    (function (TouchPhase) {
        /**
        * A finger touched the screen.
        */
        TouchPhase[TouchPhase["Began"] = 0] = "Began";

        /**
        * A finger moved on the screen.
        */
        TouchPhase[TouchPhase["Moved"] = 1] = "Moved";

        /**
        * A finger is touching the screen but hasn't moved.
        */
        TouchPhase[TouchPhase["Stationary"] = 2] = "Stationary";

        /**
        * A finger was lifted from the screen. This is the final phase of a touch.
        */
        TouchPhase[TouchPhase["Ended"] = 3] = "Ended";

        /**
        * The system cancelled tracking for the touch. This is the final phase of a touch.
        */
        TouchPhase[TouchPhase["Canceled"] = 4] = "Canceled";
    })(Vapor.TouchPhase || (Vapor.TouchPhase = {}));
    var TouchPhase = Vapor.TouchPhase;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    var Vector4 = (function () {
        /**
        * Creates a new instance of a Vector4 initialized to the given values or [0, 0, 0, 0].
        * @constructor
        */
        function Vector4(x, y, z, w) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof z === "undefined") { z = 0; }
            if (typeof w === "undefined") { w = 0; }
            this.data = new Float32Array(3);
            this.data[0] = x;
            this.data[1] = y;
            this.data[2] = z;
            this.data[3] = w;
        }
        Object.defineProperty(Vector4.prototype, "X", {
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vector4.prototype, "Y", {
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vector4.prototype, "Z", {
            get: function () {
                return this.data[2];
            },
            set: function (value) {
                this.data[2] = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vector4.prototype, "W", {
            get: function () {
                return this.data[3];
            },
            set: function (value) {
                this.data[3] = value;
            },
            enumerable: true,
            configurable: true
        });

        Vector4.Copy = function (other) {
            var copy = new Vector4();
            copy.data[0] = other.data[0];
            copy.data[1] = other.data[1];
            copy.data[2] = other.data[2];
            copy.data[3] = other.data[3];
            return copy;
        };

        /**
        * Adds the given Vector4 to this Vector4
        * @param {Vector4} other - The Vector4 to add to this one
        */
        Vector4.prototype.Add = function (other) {
            this.data[0] += other.data[0];
            this.data[1] += other.data[1];
            this.data[2] += other.data[2];
            this.data[3] += other.data[3];
        };

        /**
        * Adds the given Vector4 objects together and returns the result.
        * @param {Vector4} a - The first Vector4 to add.
        * @param {Vector4} b - The second Vector4 to add.
        * @returns {Vector4} The sum of a and b.
        */
        Vector4.Add = function (a, b) {
            var result = new Vector4();
            result.data[0] = a.data[0] + b.data[0];
            result.data[1] = a.data[1] + b.data[1];
            result.data[2] = a.data[2] + b.data[2];
            result.data[3] = a.data[3] + b.data[3];
            return result;
        };

        /**
        * Subtracts the given Vector4 from this Vector4.
        *
        * @param {Vector4} other - The Vector4 to subtract from this one
        */
        Vector4.prototype.Subtract = function (other) {
            this.data[0] -= other.data[0];
            this.data[1] -= other.data[1];
            this.data[2] -= other.data[2];
            this.data[3] -= other.data[3];
        };
        return Vector4;
    })();
    Vapor.Vector4 = Vector4;
})(Vapor || (Vapor = {}));
/// <reference path="../Math/Vector4.ts" />
var Vapor;
(function (Vapor) {
    var Color = (function () {
        function Color() {
        }
        /**
        * Creates a new Color from the given integers.
        * @param {number} r Red. 0-255.
        * @param {number} g Green. 0-255.
        * @param {number} b Blue. 0-255.
        * @param {number} a Alpha. 0-255.
        * @returns {Vector4} The new Color.
        */
        Color.FromInts = function (r, g, b, a) {
            return new Vapor.Vector4(r / 255.0, g / 255.0, b / 255.0, a / 255.0);
        };

        Color.Red = new Vapor.Vector4(1.0, 0.0, 0.0, 1.0);

        Color.Green = new Vapor.Vector4(0.0, 1.0, 0.0, 1.0);

        Color.Blue = new Vapor.Vector4(0.0, 0.0, 1.0, 1.0);

        Color.CornflowerBlue = Color.FromInts(100, 149, 237, 255);

        Color.UnityBlue = Color.FromInts(49, 77, 121, 255);

        Color.SolidBlack = new Vapor.Vector4(0.0, 0.0, 0.0, 1.0);

        Color.SolidWhite = new Vapor.Vector4(1.0, 1.0, 1.0, 1.0);

        Color.TransparentBlack = new Vapor.Vector4(0.0, 0.0, 0.0, 0.0);

        Color.TransparentWhite = new Vapor.Vector4(1.0, 1.0, 1.0, 0.0);
        return Color;
    })();
    Vapor.Color = Color;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    var BoundingBox2D = (function () {
        /**
        * Creates a new instance of a BoundingBox2D initialized to the given values or 0s.
        * @constructor
        */
        function BoundingBox2D(min, max) {
            if (typeof min === "undefined") { min = new Vapor.Vector2(); }
            if (typeof max === "undefined") { max = new Vapor.Vector2(); }
            this.min = min;
            this.max = max;
        }
        Object.defineProperty(BoundingBox2D.prototype, "Min", {
            get: function () {
                return this.min;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(BoundingBox2D.prototype, "Max", {
            get: function () {
                return this.max;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Return true if this intersects with given BoundingBox.
        * @param {BoundingBox2D} other - The BoundingBox2D to check intersection with.
        */
        BoundingBox2D.prototype.IntersectsBoundingBox = function (other) {
            return this.min.X <= other.max.X && this.min.Y <= other.max.Y && this.max.X >= other.min.X && this.max.Y >= other.min.Y;
        };
        return BoundingBox2D;
    })();
    Vapor.BoundingBox2D = BoundingBox2D;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    var BoundingBox3D = (function () {
        /**
        * Creates a new instance of a BoundingBox3D initialized to the given values or 0s.
        * @constructor
        */
        function BoundingBox3D(min, max) {
            if (typeof min === "undefined") { min = new Vapor.Vector3(); }
            if (typeof max === "undefined") { max = new Vapor.Vector3(); }
            this.min = min;
            this.max = max;
        }
        Object.defineProperty(BoundingBox3D.prototype, "Min", {
            get: function () {
                return this.min;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(BoundingBox3D.prototype, "Max", {
            get: function () {
                return this.max;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Return true if this intersects with given BoundingBox.
        * @param {BoundingBox3D} other - The BoundingBox3D to check intersection with.
        */
        BoundingBox3D.prototype.IntersectsBoundingBox = function (other) {
            return this.min.X <= other.max.X && this.min.Y <= other.max.Y && this.min.Z <= other.max.Z && this.max.X >= other.min.X && this.max.Y >= other.min.Y && this.max.Z >= other.min.Z;
        };
        return BoundingBox3D;
    })();
    Vapor.BoundingBox3D = BoundingBox3D;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    var MathHelper = (function () {
        function MathHelper() {
        }
        MathHelper.ToRadians = function (degrees) {
            // pi / 180 = 0.01745329251994329576923690768489
            return degrees * 0.01745329251994329576923690768489;
        };
        return MathHelper;
    })();
    Vapor.MathHelper = MathHelper;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    var Matrix = (function () {
        /**
        * Creates a new instance of a Matrix initialized to the identity matrix.
        * @constructor
        */
        function Matrix() {
            this.data = new Float32Array(16);
            this.data[0] = 1;
            this.data[1] = 0;
            this.data[2] = 0;
            this.data[3] = 0;

            this.data[4] = 0;
            this.data[5] = 1;
            this.data[6] = 0;
            this.data[7] = 0;

            this.data[8] = 0;
            this.data[9] = 0;
            this.data[10] = 1;
            this.data[11] = 0;

            this.data[12] = 0;
            this.data[13] = 0;
            this.data[14] = 0;
            this.data[15] = 1;
        }
        Matrix.prototype.SetIdentity = function () {
            this.data[0] = 1;
            this.data[1] = 0;
            this.data[2] = 0;
            this.data[3] = 0;

            this.data[4] = 0;
            this.data[5] = 1;
            this.data[6] = 0;
            this.data[7] = 0;

            this.data[8] = 0;
            this.data[9] = 0;
            this.data[10] = 1;
            this.data[11] = 0;

            this.data[12] = 0;
            this.data[13] = 0;
            this.data[14] = 0;
            this.data[15] = 1;
        };

        Matrix.prototype.SetZero = function () {
            this.data[0] = 0;
            this.data[1] = 0;
            this.data[2] = 0;
            this.data[3] = 0;

            this.data[4] = 0;
            this.data[5] = 0;
            this.data[6] = 0;
            this.data[7] = 0;

            this.data[8] = 0;
            this.data[9] = 0;
            this.data[10] = 0;
            this.data[11] = 0;

            this.data[12] = 0;
            this.data[13] = 0;
            this.data[14] = 0;
            this.data[15] = 0;
        };

        Matrix.Copy = function (other) {
            var copy = new Matrix();
            copy.data[0] = other.data[0];
            copy.data[1] = other.data[1];
            copy.data[2] = other.data[2];
            copy.data[3] = other.data[3];
            copy.data[4] = other.data[4];
            copy.data[5] = other.data[5];
            copy.data[6] = other.data[6];
            copy.data[7] = other.data[7];
            copy.data[8] = other.data[8];
            copy.data[9] = other.data[9];
            copy.data[10] = other.data[10];
            copy.data[11] = other.data[11];
            copy.data[12] = other.data[12];
            copy.data[13] = other.data[13];
            copy.data[14] = other.data[14];
            copy.data[15] = other.data[15];
            return copy;
        };

        /**
        * Multiplies two Matrix objects.
        *
        * @param {Matrix} a - The first operand
        * @param {Matrix} b - The second operand
        * @returns {Matrix} The result of the multiplication.
        */
        Matrix.Multiply = function (a, b) {
            // Cache the entire first matrix
            var a00 = a.data[0], a01 = a.data[1], a02 = a.data[2], a03 = a.data[3], a10 = a.data[4], a11 = a.data[5], a12 = a.data[6], a13 = a.data[7], a20 = a.data[8], a21 = a.data[9], a22 = a.data[10], a23 = a.data[11], a30 = a.data[12], a31 = a.data[13], a32 = a.data[14], a33 = a.data[15];

            // Cache only the current line of the second matrix
            var b0 = b.data[0], b1 = b.data[1], b2 = b.data[2], b3 = b.data[3];

            var out = new Matrix();
            out.data[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out.data[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out.data[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out.data[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = b.data[4];
            b1 = b.data[5];
            b2 = b.data[6];
            b3 = b.data[7];
            out.data[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out.data[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out.data[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out.data[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = b.data[8];
            b1 = b.data[9];
            b2 = b.data[10];
            b3 = b.data[11];
            out.data[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out.data[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out.data[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out.data[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = b.data[12];
            b1 = b.data[13];
            b2 = b.data[14];
            b3 = b.data[15];
            out.data[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out.data[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out.data[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out.data[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            return out;
        };

        /**
        * Rotates this Matrix by the given angle
        *
        * @param {Vector3} axis - The axis to rotate around
        * @param {Number} angle - The angle to rotate the matrix by (in radians)
        */
        Matrix.prototype.Rotate = function (axis, angle) {
            var x = axis.data[0], y = axis.data[1], z = axis.data[2], len = Math.sqrt(x * x + y * y + z * z), s, c, t, a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, b00, b01, b02, b10, b11, b12, b20, b21, b22;

            if (Math.abs(len) < Matrix.EPSILON) {
                return null;
            }

            len = 1.0 / len;
            x *= len;
            y *= len;
            z *= len;

            s = Math.sin(angle);
            c = Math.cos(angle);
            t = 1 - c;

            a00 = this.data[0];
            a01 = this.data[1];
            a02 = this.data[2];
            a03 = this.data[3];
            a10 = this.data[4];
            a11 = this.data[5];
            a12 = this.data[6];
            a13 = this.data[7];
            a20 = this.data[8];
            a21 = this.data[9];
            a22 = this.data[10];
            a23 = this.data[11];

            // Construct the elements of the rotation matrix
            b00 = x * x * t + c;
            b01 = y * x * t + z * s;
            b02 = z * x * t - y * s;
            b10 = x * y * t - z * s;
            b11 = y * y * t + c;
            b12 = z * y * t + x * s;
            b20 = x * z * t + y * s;
            b21 = y * z * t - x * s;
            b22 = z * z * t + c;

            // Perform rotation-specific matrix multiplication
            this.data[0] = a00 * b00 + a10 * b01 + a20 * b02;
            this.data[1] = a01 * b00 + a11 * b01 + a21 * b02;
            this.data[2] = a02 * b00 + a12 * b01 + a22 * b02;
            this.data[3] = a03 * b00 + a13 * b01 + a23 * b02;
            this.data[4] = a00 * b10 + a10 * b11 + a20 * b12;
            this.data[5] = a01 * b10 + a11 * b11 + a21 * b12;
            this.data[6] = a02 * b10 + a12 * b11 + a22 * b12;
            this.data[7] = a03 * b10 + a13 * b11 + a23 * b12;
            this.data[8] = a00 * b20 + a10 * b21 + a20 * b22;
            this.data[9] = a01 * b20 + a11 * b21 + a21 * b22;
            this.data[10] = a02 * b20 + a12 * b21 + a22 * b22;
            this.data[11] = a03 * b20 + a13 * b21 + a23 * b22;
        };

        /**
        * Scales this Matrix by the dimensions in the given Vector3
        *
        * @param {Vector3} scale - The Vector3 to scale the matrix by
        **/
        Matrix.prototype.Scale = function (scale) {
            var x = scale.data[0], y = scale.data[1], z = scale.data[2];

            this.data[0] = this.data[0] * x;
            this.data[1] = this.data[1] * x;
            this.data[2] = this.data[2] * x;
            this.data[3] = this.data[3] * x;
            this.data[4] = this.data[4] * y;
            this.data[5] = this.data[5] * y;
            this.data[6] = this.data[6] * y;
            this.data[7] = this.data[7] * y;
            this.data[8] = this.data[8] * z;
            this.data[9] = this.data[9] * z;
            this.data[10] = this.data[10] * z;
            this.data[11] = this.data[11] * z;
            //this.data[12] = this.data[12];
            //this.data[13] = this.data[13];
            //this.data[14] = this.data[14];
            //this.data[15] = this.data[15];
        };

        /**
        * Sets this Matrix to the given rotation (Quaternion) and translation (Vector3)
        *
        * @param {Vector3} position - Translation vector
        * @param {Quaternion} rotation - Rotation quaternion
        */
        Matrix.prototype.FromTranslationRotation = function (position, rotation) {
            // Quaternion math
            var x = rotation.data[0], y = rotation.data[1], z = rotation.data[2], w = rotation.data[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;

            this.data[0] = 1 - (yy + zz);
            this.data[1] = xy + wz;
            this.data[2] = xz - wy;
            this.data[3] = 0;
            this.data[4] = xy - wz;
            this.data[5] = 1 - (xx + zz);
            this.data[6] = yz + wx;
            this.data[7] = 0;
            this.data[8] = xz + wy;
            this.data[9] = yz - wx;
            this.data[10] = 1 - (xx + yy);
            this.data[11] = 0;
            this.data[12] = position.data[0];
            this.data[13] = position.data[1];
            this.data[14] = position.data[2];
            this.data[15] = 1;
        };

        /**
        * Generates a look-at matrix with the given eye position, focal point, and up axis
        *
        * @param {vec3} eye Position of the viewer
        * @param {vec3} center Point the viewer is looking at
        * @param {vec3} up vec3 pointing up
        */
        Matrix.prototype.SetLookAt = function (eye, center, up) {
            var x0, x1, x2, y0, y1, y2, z0, z1, z2, len, eyex = eye.data[0], eyey = eye.data[1], eyez = eye.data[2], upx = up.data[0], upy = up.data[1], upz = up.data[2], centerx = center.data[0], centery = center.data[1], centerz = center.data[2];

            if (Math.abs(eyex - centerx) < Matrix.EPSILON && Math.abs(eyey - centery) < Matrix.EPSILON && Math.abs(eyez - centerz) < Matrix.EPSILON) {
                this.SetIdentity();
            }

            z0 = eyex - centerx;
            z1 = eyey - centery;
            z2 = eyez - centerz;

            len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            z0 *= len;
            z1 *= len;
            z2 *= len;

            x0 = upy * z2 - upz * z1;
            x1 = upz * z0 - upx * z2;
            x2 = upx * z1 - upy * z0;
            len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
            if (!len) {
                x0 = 0;
                x1 = 0;
                x2 = 0;
            } else {
                len = 1 / len;
                x0 *= len;
                x1 *= len;
                x2 *= len;
            }

            y0 = z1 * x2 - z2 * x1;
            y1 = z2 * x0 - z0 * x2;
            y2 = z0 * x1 - z1 * x0;

            len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
            if (!len) {
                y0 = 0;
                y1 = 0;
                y2 = 0;
            } else {
                len = 1 / len;
                y0 *= len;
                y1 *= len;
                y2 *= len;
            }

            this.data[0] = x0;
            this.data[1] = y0;
            this.data[2] = z0;
            this.data[3] = 0;
            this.data[4] = x1;
            this.data[5] = y1;
            this.data[6] = z1;
            this.data[7] = 0;
            this.data[8] = x2;
            this.data[9] = y2;
            this.data[10] = z2;
            this.data[11] = 0;
            this.data[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
            this.data[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
            this.data[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
            this.data[15] = 1;
        };

        /**
        * Constructs an OpenGL perspective projection matrix in this Matrix.
        *
        * [fovYRadians] specifies the field of view angle, in radians, in the y direction.
        * [aspectRatio] specifies the aspect ratio that determines the field of view in the x direction.
        *  The aspect ratio of x (width) to y (height).
        * [zNear] specifies the distance from the viewer to the near plane (always positive).
        * [zFar] specifies the distance from the viewer to the far plane (always positive).
        */
        Matrix.prototype.SetPerspectiveMatrix = function (fovYRadians, aspectRatio, zNear, zFar) {
            var height = Math.tan(fovYRadians * 0.5) * zNear;
            var width = height * aspectRatio;
            this.SetFrustumMatrix(-width, width, -height, height, zNear, zFar);
        };

        /**
        * Constructs an OpenGL perspective projection matrix in this Matrix.
        *
        * [left], [right] specify the coordinates for the left and right vertical clipping planes.
        * [bottom], [top] specify the coordinates for the bottom and top horizontal clipping planes.
        * [near], [far] specify the coordinates to the near and far depth clipping planes.
        */
        Matrix.prototype.SetFrustumMatrix = function (left, right, bottom, top, near, far) {
            var two_near = 2.0 * near;
            var right_minus_left = right - left;
            var top_minus_bottom = top - bottom;
            var far_minus_near = far - near;
            this.SetZero();

            //[row, column] = [column * 4 + row]
            this.data[0] = two_near / right_minus_left; //[0, 0]
            this.data[5] = two_near / top_minus_bottom; //[1, 1]
            this.data[8] = (right + left) / right_minus_left; //[0, 2]
            this.data[9] = (top + bottom) / top_minus_bottom; //[1, 2]
            this.data[10] = -(far + near) / far_minus_near; //[2, 2]
            this.data[11] = -1.0; //[3, 2]
            this.data[14] = -(two_near * far) / far_minus_near; //[2, 3]
        };

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
        Matrix.Unproject = function (cameraMatrix, viewportX, viewportWidth, viewportY, viewportHeight, pickX, pickY, pickZ, pickWorld) {
            pickX = (pickX - viewportX);
            pickY = (pickY - viewportY);
            pickX = (2.0 * pickX / viewportWidth) - 1.0;
            pickY = (2.0 * pickY / viewportHeight) - 1.0;
            pickZ = (2.0 * pickZ) - 1.0;

            // Check if pick point is inside unit cube
            if (pickX < -1.0 || pickY < -1.0 || pickX > 1.0 || pickY > 1.0 || pickZ < -1.0 || pickZ > 1.0) {
                return false;
            }

            // Copy camera matrix.
            var invertedCameraMatrix = Matrix.Copy(cameraMatrix);

            // Invert the camera matrix.
            invertedCameraMatrix.Invert();

            // Determine intersection point.
            var v = new Vapor.Vector4(pickX, pickY, pickZ, 1.0);
            invertedCameraMatrix.Transform(v);
            if (v.W == 0.0) {
                return false;
            }

            var invW = 1.0 / v.W;
            pickWorld.X = v.X * invW;
            pickWorld.Y = v.Y * invW;
            pickWorld.Z = v.Z * invW;

            return true;
        };

        Matrix.prototype.Invert = function () {
            var a00 = this.data[0];
            var a01 = this.data[1];
            var a02 = this.data[2];
            var a03 = this.data[3];
            var a10 = this.data[4];
            var a11 = this.data[5];
            var a12 = this.data[6];
            var a13 = this.data[7];
            var a20 = this.data[8];
            var a21 = this.data[9];
            var a22 = this.data[10];
            var a23 = this.data[11];
            var a30 = this.data[12];
            var a31 = this.data[13];
            var a32 = this.data[14];
            var a33 = this.data[15];

            var b00 = a00 * a11 - a01 * a10;
            var b01 = a00 * a12 - a02 * a10;
            var b02 = a00 * a13 - a03 * a10;
            var b03 = a01 * a12 - a02 * a11;
            var b04 = a01 * a13 - a03 * a11;
            var b05 = a02 * a13 - a03 * a12;
            var b06 = a20 * a31 - a21 * a30;
            var b07 = a20 * a32 - a22 * a30;
            var b08 = a20 * a33 - a23 * a30;
            var b09 = a21 * a32 - a22 * a31;
            var b10 = a21 * a33 - a23 * a31;
            var b11 = a22 * a33 - a23 * a32;
            var det = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
            if (det == 0.0) {
                return det;
            }
            var invDet = 1.0 / det;

            this.data[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
            this.data[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
            this.data[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
            this.data[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
            this.data[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
            this.data[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
            this.data[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
            this.data[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
            this.data[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
            this.data[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
            this.data[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
            this.data[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
            this.data[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
            this.data[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
            this.data[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
            this.data[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

            return det;
        };

        /**
        * Transforms the given Vector4 by this Matrix.
        *
        */
        Matrix.prototype.Transform = function (arg) {
            var x_ = (this.data[0] * arg.data[0]) + (this.data[4] * arg.data[1]) + (this.data[8] * arg.data[2]) + (this.data[12] * arg.data[3]);
            var y_ = (this.data[1] * arg.data[0]) + (this.data[5] * arg.data[1]) + (this.data[9] * arg.data[2]) + (this.data[13] * arg.data[3]);
            var z_ = (this.data[2] * arg.data[0]) + (this.data[6] * arg.data[1]) + (this.data[10] * arg.data[2]) + (this.data[14] * arg.data[3]);
            var w_ = (this.data[3] * arg.data[0]) + (this.data[7] * arg.data[1]) + (this.data[11] * arg.data[2]) + (this.data[15] * arg.data[3]);
            arg.X = x_;
            arg.Y = y_;
            arg.Z = z_;
            arg.W = w_;
            return arg;
        };
        Matrix.EPSILON = 0.000001;
        return Matrix;
    })();
    Vapor.Matrix = Matrix;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    var Quaternion = (function () {
        /**
        * Creates a new instance of a Quaternion initialized to the identity.
        * @constructor
        */
        function Quaternion() {
            this.data = new Float32Array(4);
            this.data[0] = 0;
            this.data[1] = 0;
            this.data[2] = 0;
            this.data[3] = 1;
        }
        /**
        * Set quaternion with rotation of yaw, pitch and roll stored in the given Vector3.
        */
        Quaternion.prototype.SetEuler = function (eulerAngles) {
            var yaw = eulerAngles.data[0];
            var pitch = eulerAngles.data[1];
            var roll = eulerAngles.data[2];

            var halfYaw = yaw * 0.5;
            var halfPitch = pitch * 0.5;
            var halfRoll = roll * 0.5;
            var cosYaw = Math.cos(halfYaw);
            var sinYaw = Math.sin(halfYaw);
            var cosPitch = Math.cos(halfPitch);
            var sinPitch = Math.sin(halfPitch);
            var cosRoll = Math.cos(halfRoll);
            var sinRoll = Math.sin(halfRoll);

            this.data[0] = cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw;
            this.data[1] = cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw;
            this.data[2] = sinRoll * cosPitch * cosYaw - cosRoll * sinPitch * sinYaw;
            this.data[3] = cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw;
        };
        return Quaternion;
    })();
    Vapor.Quaternion = Quaternion;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    var Vector2 = (function () {
        /**
        * Creates a new instance of a Vector3 initialized to the given values or [0, 0].
        * @constructor
        */
        function Vector2(x, y) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            this.data = new Float32Array(2);
            this.data[0] = x;
            this.data[1] = y;
        }
        Object.defineProperty(Vector2.prototype, "X", {
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Vector2.prototype, "Y", {
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Adds the given Vector2 to this Vector2
        * @param {Vector2} other - The Vector2 to add to this one
        */
        Vector2.prototype.Add = function (other) {
            this.data[0] += other.data[0];
            this.data[1] += other.data[1];
        };

        /**
        * Adds the given Vector2 objects together and returns the result.
        * @param {Vector2} a - The first Vector2 to add.
        * @param {Vector2} b - The second Vector2 to add.
        * @returns {Vector2} The sum of a and b.
        */
        Vector2.Add = function (a, b) {
            var result = new Vector2();
            result.data[0] = a.data[0] + b.data[0];
            result.data[1] = a.data[1] + b.data[1];
            return result;
        };
        return Vector2;
    })();
    Vapor.Vector2 = Vector2;
})(Vapor || (Vapor = {}));
/**
* Box2DWeb-2.1.d.ts Copyright (c) 2012-2013 Josh Baldwin http://github.com/jbaldwin/box2dweb.d.ts
* There are a few competing javascript Box2D ports.
* This definitions file is for Box2dWeb.js ->
*   http://code.google.com/p/box2dweb/
*
* Box2D C++ Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
*    claim that you wrote the original software. If you use this software
*    in a product, an acknowledgment in the product documentation would be
*    appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
*    misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
**/
var Vapor;
(function (Vapor) {
    /**
    * Represents a collider for use with the Box2D physics engine.
    * The base class for all Collider objects.
    */
    var Collider = (function (_super) {
        __extends(Collider, _super);
        function Collider() {
            _super.apply(this, arguments);
            /**
            * True if the body associated with this Collider is used as a Box2D sensor.
            * Defaults to false.
            */
            this.isSensor = false;
        }
        Object.defineProperty(Collider.prototype, "FixtureDefinition", {
            /**
            * The FixtureDef that was used to create this collider.
            */
            get: function () {
                return this.fixtureDef;
            },
            enumerable: true,
            configurable: true
        });

        Collider.prototype.Start = function () {
            // first just set to the rigid body attached to this object
            this.attachedRigidbody = this.gameObject.rigidbody;

            // next try to find a rigid body on the parents
            var parent = this.gameObject.parent;
            while (parent != null) {
                console.log("Parent = " + parent.Name);

                if (parent.rigidbody != null) {
                    this.attachedRigidbody = parent.rigidbody;
                }

                parent = parent.parent;
            }

            if (this.attachedRigidbody == null) {
                console.error("You must first attach a RigidBody component.");
            }
        };
        return Collider;
    })(Vapor.Component);
    Vapor.Collider = Collider;
})(Vapor || (Vapor = {}));
/// <reference path="Collider.ts" />
var Vapor;
(function (Vapor) {
    /**
    * Represents a collider that is a box shape.
    */
    var BoxCollider = (function (_super) {
        __extends(BoxCollider, _super);
        function BoxCollider() {
            _super.apply(this, arguments);
            this.center = new Vapor.Vector2(0.0, 0.0);
            this.size = new Vapor.Vector2(1.0, 1.0);
        }
        BoxCollider.prototype.Awake = function () {
            var shape = new Box2D.Collision.Shapes.b2PolygonShape();
            var center = new Box2D.Common.Math.b2Vec2(this.center.X, this.center.Y);
            shape.SetAsOrientedBox(this.size.X / 2, this.size.Y / 2, center, 0.0);

            this.fixtureDef = new Box2D.Dynamics.b2FixtureDef();
            this.fixtureDef.restitution = 0.5;
            this.fixtureDef.density = 0.05;

            //this.fixtureDef.friction = 0.1;
            this.fixtureDef.shape = shape;
            this.fixtureDef.isSensor = this.isSensor;
        };

        BoxCollider.prototype.Start = function () {
            _super.prototype.Start.call(this);

            this.fixture = this.attachedRigidbody.body.CreateFixture(this.fixtureDef);
        };

        BoxCollider.prototype.Update = function () {
            var polygon = this.fixture.GetShape();
            ;

            //var pos = Box2D.Transform.mul(attachedRigidbody.body.originTransform, polygon.centroid);
            // TODO: Figure out how to ge the position of the box
            //var pos = Box2D.Common.Math.b2Math.MulX(this.attachedRigidbody.body.GetTransform(), polygon.ComputeAABB().);
            var pos = this.attachedRigidbody.body.GetPosition();

            this.transform.position = new Vapor.Vector3(pos.x, pos.y, this.transform.position.Z);
            this.transform.EulerAngles = new Vapor.Vector3(this.transform.EulerAngles.X, this.transform.EulerAngles.Y, this.attachedRigidbody.body.GetAngle());
        };
        return BoxCollider;
    })(Vapor.Collider);
    Vapor.BoxCollider = BoxCollider;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    /**
    *
    */
    var CircleCollider = (function (_super) {
        __extends(CircleCollider, _super);
        function CircleCollider(radius) {
            if (typeof radius === "undefined") { radius = 1.0; }
            _super.call(this, "CircleCollider");
            /**
            * Does nothing since there is no way to set the center point of a Circle fixture.
            * I belive this is a bug with the Dart port of Box2D.
            */
            this.center = new Vapor.Vector2(0.0, 0.0);
            this.radius = 1.0;
            this.radius = radius;
        }
        CircleCollider.prototype.Awake = function () {
            var shape = new Box2D.Collision.Shapes.b2CircleShape();

            //shape.SetLocalPosition(this.center);
            shape.SetRadius(this.radius);

            this.fixtureDef = new Box2D.Dynamics.b2FixtureDef();
            this.fixtureDef.restitution = 0.5;
            this.fixtureDef.density = 0.05;

            //this.fixtureDef.friction = 0.1;
            this.fixtureDef.shape = shape;
            this.fixtureDef.isSensor = this.isSensor;
        };

        CircleCollider.prototype.Start = function () {
            _super.prototype.Start.call(this);
            this.fixture = this.attachedRigidbody.body.CreateFixture(this.fixtureDef);
        };

        CircleCollider.prototype.Update = function () {
            var circle = this.fixture.GetShape();

            //var pos = Box2D.Common.Math.b2Transform.mul(this.attachedRigidbody.body.GetTransform(), circle.GetLocalPosition());
            var pos = Box2D.Common.Math.b2Math.MulX(this.attachedRigidbody.body.GetTransform(), circle.GetLocalPosition());

            this.transform.position = new Vapor.Vector3(pos.x, pos.y, this.transform.position.Z);
            this.transform.EulerAngles = new Vapor.Vector3(this.transform.EulerAngles.X, this.transform.EulerAngles.Y, this.attachedRigidbody.body.GetAngle());

            //transform.position = new Vector3(gameObject.rigidbody.body.position.x, gameObject.rigidbody.body.position.y, transform.position.z);
            //transform.eulerAngles = new Vector3(transform.eulerAngles.x, transform.eulerAngles.y, gameObject.rigidbody.body.angle);
            var contactList = this.attachedRigidbody.body.GetContactList();
            if (contactList != null && contactList.contact != null) {
                if (contactList.contact.IsTouching()) {
                    this.gameObject.OnCollision(contactList.contact);
                }
            }
        };
        return CircleCollider;
    })(Vapor.Collider);
    Vapor.CircleCollider = CircleCollider;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    /**
    *
    */
    var RevoluteJoint = (function (_super) {
        __extends(RevoluteJoint, _super);
        function RevoluteJoint() {
            _super.apply(this, arguments);
            this.radius = 1.0;
            this.enableMotor = false;
        }
        RevoluteJoint.prototype.Awake = function () {
            this.jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
            this.jointDef.enableMotor = this.enableMotor;
            //_jointDef.initialize(gameObject.rigidbody.body, connectedRigidBody.body, anchor);
        };

        RevoluteJoint.prototype.Start = function () {
            var anchor = new Box2D.Common.Math.b2Vec2(this.anchor.X, this.anchor.Y);
            this.jointDef.Initialize(this.gameObject.rigidbody.body, this.connectedRigidBody.body, anchor);
            this.revoluteJoint = this.scene.world.CreateJoint(this.jointDef);
        };
        return RevoluteJoint;
    })(Vapor.Component);
    Vapor.RevoluteJoint = RevoluteJoint;
})(Vapor || (Vapor = {}));
var Vapor;
(function (Vapor) {
    /**
    * A body type enum. There are three types of bodies.
    *
    * Static: Have zero mass, zero velocity and can be moved manually.
    *
    * Kinematic: Have zero mass, a non-zero velocity set by user, and are moved by
    *   the physics solver.
    *
    * Dynamic: Have positive mass, non-zero velocity determined by forces, and is
    *   moved by the physics solver.
    */
    (function (BodyType) {
        BodyType[BodyType["Static"] = 0] = "Static";
        BodyType[BodyType["Kinematic"] = 1] = "Kinematic";
        BodyType[BodyType["Dynamic"] = 2] = "Dynamic";
    })(Vapor.BodyType || (Vapor.BodyType = {}));
    var BodyType = Vapor.BodyType;

    /**
    * Represents a Rigid Body for use with the Box2D physics engine.
    */
    var RigidBody = (function (_super) {
        __extends(RigidBody, _super);
        /**
        * Constructs a new RigidBody using the given body type.  Defaults to Box2D.BodyType.DYNAMIC.
        */
        function RigidBody(bodyType) {
            if (typeof bodyType === "undefined") { bodyType = 2 /* Dynamic */; }
            _super.call(this, "RigidBody");
            /**
            * The type of body (Dynamic, Static, or Kinematic) associated with this Collider.
            * Defaults to Dynamic.
            * The types are defined in Box2D.BodyType.
            */
            this.bodyType = 2 /* Dynamic */;
            this.bodyType = bodyType;
        }
        Object.defineProperty(RigidBody.prototype, "BodyDefinition", {
            /**
            * The Box2D.BodyDef that was used to create this Rigid Body.
            */
            get: function () {
                return this.bodyDef;
            },
            enumerable: true,
            configurable: true
        });

        RigidBody.prototype.Awake = function () {
            this.bodyDef = new Box2D.Dynamics.b2BodyDef();
            this.bodyDef.type = this.bodyType;
            this.bodyDef.position = new Box2D.Common.Math.b2Vec2(this.transform.position.X, this.transform.position.Y);
        };

        RigidBody.prototype.Start = function () {
            this.body = this.gameObject.scene.world.CreateBody(this.bodyDef);

            //this.body.SetTransform(transform.position.xy, transform.eulerAngles.z);
            var position = new Box2D.Common.Math.b2Vec2(this.transform.position.X, this.transform.position.Y);
            this.body.SetPositionAndAngle(position, this.transform.EulerAngles.Z);
        };
        return RigidBody;
    })(Vapor.Component);
    Vapor.RigidBody = RigidBody;
})(Vapor || (Vapor = {}));
Array.prototype.add = function (item) {
    this.push(item);
};

Array.prototype.clear = function () {
    this.length = 0;
};

Array.prototype.clone = function () {
    return this.slice(0);
};

Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    if (index > -1) {
        this.splice(index, 1);
    }
};

Array.prototype.removeAt = function (index) {
    if (index > -1) {
        this.splice(index, 1);
    }
};
//class Dictionary<T, U> {
//    constructor() {
//        // nothing
//    }
//    Add(key: T, value: U) {
//        this[T] = U;
//    }
//    Remove(item: T) {
//        var index = this.data.indexOf(item);
//        if (index > -1) {
//            this.data.splice(index, 1);
//        }
//    }
//    RemoveAt(index: number) {
//        if (index > -1) {
//            this.data.splice(index, 1);
//        }
//    }
//    Clear() {
//        this.data.length = 0;
//    }
//    Get(index: number): T {
//        if (index > -1) {
//            return this.data[index];
//        }
//    }
//    [n: number]: T;
//}
var Vapor;
(function (Vapor) {
    var FileDownloader = (function () {
        function FileDownloader() {
        }
        /**
        * Download the file at the given URL.  It ONLY downloads asynchronously.
        * (Modern browsers are deprecating synchronous requests, and now throw exceptions when trying to do a sychronous request with a responseType)
        * The callback is called after the file is done loading.
        * The callback is in the form: Callback(request: XMLHttpRequest): void
        */
        FileDownloader.Download = function (url, callback, responseType) {
            if (typeof responseType === "undefined") { responseType = "text"; }
            try  {
                var request = new XMLHttpRequest();

                request.open('GET', url, true);
                request.responseType = responseType;
                request.onload = function () {
                    if (request.readyState === 4) {
                        if (request.status === 200) {
                            callback(request);
                        } else {
                            console.error(request.statusText);
                        }
                    }
                };
                request.onerror = function () {
                    console.error(request.statusText);
                };
                request.send();
            } catch (e) {
                console.log("Exception caught in FileDownloader.Download(): " + e);
            }

            return request;
        };

        /**
        * Download the file at the given URL as an ArrayBuffer (useful for Audio).
        */
        FileDownloader.DownloadArrayBuffer = function (url, callback) {
            return FileDownloader.Download(url, callback, "arraybuffer");
        };

        /**
        * Download the file at the given URL as a Blob (useful for Images).
        */
        FileDownloader.DownloadBlob = function (url, callback) {
            return FileDownloader.Download(url, callback, "blob");
        };

        /**
        * Download the file at the given URL as a Document (useful for XML and HTML).
        */
        FileDownloader.DownloadDocument = function (url, callback) {
            return FileDownloader.Download(url, callback, "document");
        };

        /**
        * Download the file at the given URL as a JavaScript object parsed from the JSON string returned by the server.
        */
        FileDownloader.DownloadJSON = function (url, callback) {
            return FileDownloader.Download(url, callback, "json");
        };

        /**
        * Download the file at the given URL in a synchronous (blocking) manner.
        */
        FileDownloader.DownloadSynchronous = function (url) {
            try  {
                var request = new XMLHttpRequest();
                request.open("GET", url, false);
                request.send();
            } catch (e) {
                console.log("Exception caught in FileDownloader.DownloadSynchronous()");
            }

            if (request.status != 200) {
                console.log("FileDownloader Error! " + request.status.toString() + " " + request.statusText);
            }

            return request;
        };
        return FileDownloader;
    })();
    Vapor.FileDownloader = FileDownloader;
})(Vapor || (Vapor = {}));
var List = (function () {
    function List() {
        this.data = new Array();
    }
    List.prototype.Add = function (item) {
        this.data.push(item);
    };

    List.prototype.Remove = function (item) {
        var index = this.data.indexOf(item);
        if (index > -1) {
            this.data.splice(index, 1);
        }
    };

    List.prototype.RemoveAt = function (index) {
        if (index > -1) {
            this.data.splice(index, 1);
        }
    };

    List.prototype.Clear = function () {
        this.data.length = 0;
    };

    List.prototype.Get = function (index) {
        if (index > -1) {
            return this.data[index];
        }
    };
    return List;
})();
var Vapor;
(function (Vapor) {
    /**
    * A static class offering access to time related fields.
    * @class Represents a Mesh
    */
    var Time = (function () {
        function Time() {
        }
        /**
        * @private
        */
        Time.Update = function () {
            var currentTime = performance.now();
            Time.deltaTime = (currentTime - Time.previousTime) / 1000.0;
            Time.previousTime = currentTime;
            //console.log(Time.deltaTime);
        };
        Time.deltaTime = 0.0;

        Time.previousTime = performance.now();
        return Time;
    })();
    Vapor.Time = Time;
})(Vapor || (Vapor = {}));
/// <reference path="Audio/AudioManager.ts" />
/// <reference path="Audio/AudioSource.ts" />
/// <reference path="Audio/waa.ts" />
/// <reference path="Game/Component.ts" />
/// <reference path="Game/GameObject.ts" />
/// <reference path="Game/Scene.ts" />
/// <reference path="Game/VaporObject.ts" />
/// <reference path="Graphics/Camera.ts" />
/// <reference path="Graphics/Canvas.ts" />
/// <reference path="Graphics/Color.ts" />
/// <reference path="Graphics/Material.ts" />
/// <reference path="Graphics/Mesh.ts" />
/// <reference path="Graphics/MeshRenderer.ts" />
/// <reference path="Graphics/Renderer.ts" />
/// <reference path="Graphics/Shader.ts" />
/// <reference path="Graphics/ShaderType.ts" />
/// <reference path="Graphics/Texture2D.ts" />
/// <reference path="Input/Keyboard.ts" />
/// <reference path="Input/KeyCode.ts" />
/// <reference path="Input/Mouse.ts" />
/// <reference path="Input/Touch.ts" />
/// <reference path="Input/TouchData.ts" />
/// <reference path="Input/TouchPhase.ts" />
/// <reference path="Math/BoundingBox2D.ts" />
/// <reference path="Math/BoundingBox3D.ts" />
/// <reference path="Math/MathHelper.ts" />
/// <reference path="Math/Matrix.ts" />
/// <reference path="Math/Quaternion.ts" />
/// <reference path="Math/Transform.ts" />
/// <reference path="Math/Vector2.ts" />
/// <reference path="Math/Vector3.ts" />
/// <reference path="Math/Vector4.ts" />
/// <reference path="Physics/box2dweb.ts" />
/// <reference path="Physics/BoxCollider.ts" />
/// <reference path="Physics/CircleCollider.ts" />
/// <reference path="Physics/Collider.ts" />
/// <reference path="Physics/RigidBody.ts" />
/// <reference path="Utilities/ArrayExtensions.ts" />
/// <reference path="Utilities/FileDownloader.ts" />
/// <reference path="Utilities/Time.ts" />
/**
* The global handle to the current instance of the WebGL rendering context.
*/
var gl;

window.onload = function () {
    var audioManager = new Vapor.AudioManager();
    var audioSource = new Vapor.AudioSource.FromFile(audioManager, "Funeral.mp3", function (source) {
        source.Play();
    });

    var scene = new Vapor.Scene();

    Vapor.Shader.FromFile("Shaders/white.glsl", function (shader) {
        var material = new Vapor.Material(shader);

        var camera = Vapor.GameObject.CreateCamera();
        camera.transform.position = new Vapor.Vector3(0.0, 0.0, -7.0);
        camera.camera.backgroundColor = Vapor.Color.SolidBlack;
        scene.AddGameObject(camera);

        var triangle = Vapor.GameObject.CreateTriangle();
        triangle.renderer.material = material;

        //triangle.transform.position = new Vapor.Vector3(-1.5, 0.0, 7.0);
        triangle.transform.position = new Vapor.Vector3(-1.5, 0.0, 0.0);
        scene.AddGameObject(triangle);

        var paddle1 = Vapor.GameObject.CreateQuad();

        //paddle1.transform.Scale = new Vapor.Vector3(1.0, 2.0, 1.0);
        paddle1.renderer.material = material;
        paddle1.transform.position = new Vapor.Vector3(1.5, 0.0, 0.0);
        scene.AddGameObject(paddle1);
    });
};
//# sourceMappingURL=Vapor.js.map
