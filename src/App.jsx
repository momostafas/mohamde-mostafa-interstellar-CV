import { useEffect } from 'react';

import * as THREE from 'three';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { VOXLoader } from 'three/examples/jsm/loaders/VOXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import SceneInit from './lib/SceneInit';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    var loadedModel;
    const glftLoader = new GLTFLoader();
    const fbxLoader = new FBXLoader();
    var astronautScene = null;
    glftLoader.load('./assets/shiba/scene.gltf', (gltfScene) => {
      loadedModel = gltfScene.scene;

      // console.log(loadedModel);
      loadedModel.position.y = 3;
      loadedModel.position.z = -150;
      loadedModel.position.x = -50;
      loadedModel.rotation.x = 90;
      test.scene.add(loadedModel);
    });
    //create image
    var bitmap = document.createElement('canvas');
    var g = bitmap.getContext('2d');
    bitmap.width = 100;
    bitmap.height = 100;
    g.font = 'Bold 20px Arial';

    g.fillStyle = 'white';
    g.fillText('text', 0, 20);
    g.strokeStyle = 'black';
    g.strokeText('dsadas', 0, 20);

    // canvas contents will be used for a texture
    var texture = new THREE.Texture(bitmap);
    texture.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
    });


    var c = document.createElement("canvas");
    c.width = 256;
    c.height = 128;
    var ctx = c.getContext("2d");
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "magenta";
    ctx.font = "bold 36px Arial";
    var text = "I love Three.js";
    ctx.fillText(text, c.width * 0.5, c.height * 0.5);
    ctx.strokeStyle = "red";
    ctx.strokeText(text, c.width * 0.5, c.height * 0.5);
    var tex = new THREE.CanvasTexture(c);
    tex.offset.y = 0.25;
    
    var u = {
      time: {value: 0},
      textTex: {value: tex}
  }
    
    var g = new THREE.CylinderGeometry(2, 2, 4.5, 36, 1, true);
    g.rotateY(Math.PI);
    var m = new THREE.MeshLambertMaterial({
        color: 0x7f7f64,
      map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/floors/FloorsCheckerboard_S_Diffuse.jpg", tex => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set( 3, 1 );
      }),
      side: THREE.DoubleSide,
      onBeforeCompile: shader => {
        shader.uniforms.time = u.time;
        shader.uniforms.textTex = u.textTex;
        shader.fragmentShader = `
            uniform float time;
            uniform sampler2D textTex;
          ${shader.fragmentShader}
        `.replace(
            `#include <map_fragment>`,
          `#include <map_fragment>
          
            vec4 textCol = texture(textTex, (vUv * 2. - 0.5) + vec2(-2., sin(time) * 0.25));
            vec3 col = mix(diffuseColor.rgb, textCol.rgb, textCol.a);
            diffuseColor = vec4( col, opacity );
          `
        );
        //console.log(shader.fragmentShader);
      }
    });
    m.defines = {"USE_UV" : ""};
    var o = new THREE.Mesh(g, m);
    test.scene.add(o);
    const geometry = new THREE.CylinderGeometry(34, 34, 10, 20, 4, true);

    const cylinder = new THREE.Mesh(geometry, m);
    cylinder.position.set(-50, 8, -153);
    cylinder.rotateX(10);

    cylinder.rotateY(11);
    // cylinder.rotateZ(10);
    test.scene.add(cylinder);
    

    const loader = new FBXLoader();
    // glftLoader.load( './assets/astronaut/scene.gltf', function ( astronaut ) {
    //   loader.load( './assets/astronaut/Salute (8).fbx', function ( flying ) {

    //   astronautScene = astronaut.scene;
    //   astronautScene.position.x = 0;
    //   astronautScene.position.y = 0;
    //   astronautScene.position.z = 0;

    //   astronautScene.scale.set(4, 4, 4);

    //   astronaut.animations.push(flying.animations[ 0]);

    //   test.mixer = new THREE.AnimationMixer( astronautScene );

    //   const action = test.mixer.clipAction( astronaut.animations[ 0] );

    //   // action.setLoop(true, 1);
    //   // action.play();

    //   test.singleStepMode = true;
    //   test.scene.add( astronautScene );

    // } );
    // } );

    const animate = () => {
      // if (loadedModel) {
      //   loadedModel.rotation.z += 0.01;
      // }
      var mixerUpdateDelta = test.clock.getDelta();

      // Update the animation mixer, the stats panel, and render this frame

      if (test.mixer) {
        test.mixer.update(mixerUpdateDelta);
      }

      // var tween = new TWEEN.Tween(test.camera.position)
      //   .to({ x: -50, y: 3, z: -150 }, 10000)
      //   .start();
      // TWEEN.update();

      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
