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
import { Text3DFacade } from 'troika-3d-text';
import { TextMesh } from 'troika-3d-text/dist/troika-3d-text.esm';
import { MeshBasicMaterial } from 'three';
import $ from 'jquery';

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    // be sure to call sync() after all properties are set to update the rendering:
    var endurance;
    const glftLoader = new GLTFLoader();
    const fbxLoader = new FBXLoader();
    var flyingAction = null;
    var saluteAction = null;
    var astronautScene = null;
    let tesseractTexture = new THREE.TextureLoader().load(
      '../../assets/tesseract/textures/material.png'
    );
    let tesseractBoxMaterial = new THREE.MeshPhongMaterial({
      map: tesseractTexture,
    });

    glftLoader.load('./assets/shiba/scene.gltf', (gltfScene) => {
      endurance = gltfScene.scene;

      // console.log(endurance);
      endurance.rotation.x = (90 * Math.PI) / 180;
      endurance.position.set(-25, -25, -100);
      test.scene.add(endurance);
    });

    function createTesseractUnit(faces, boxWidth, boxHeight) {
      let BoxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, 0);
      const box = new THREE.Mesh(BoxGeometry, tesseractBoxMaterial);
      let TesseractUnitGroup = new THREE.Group();
      for (let index = 1; index < faces + 1; index++) {
        const unitWall = new THREE.Mesh(BoxGeometry, tesseractBoxMaterial);
        unitWall.position.set(
          index % 2
            ? 0
            : index > faces / 2
            ? box.position.x - boxWidth
            : box.position.x + boxWidth,
          index % 2
            ? index > faces / 2
              ? box.position.y - boxHeight
              : box.position.y + boxHeight
            : 0,
          0
        );
        TesseractUnitGroup.add(unitWall);
      }
      return TesseractUnitGroup;
    }

    function creatreTesseractScene(faces, length) {
      const group = new THREE.Group();

      for (let index = 1; index < faces + 1; index++) {
        let tesseractUnit = createTesseractUnit(4, 20, 20);

        tesseractUnit.position.set(
          index % 3 == 1 ? (index > faces / 2 ? -length : length) : 0,
          index % 3 == 0 ? (index > faces / 2 ? -length : length) : 0,
          index % 3 == 2 ? (index > faces / 2 ? -length : length) : 0
        );

        tesseractUnit.rotation.set(
          index % 3 == 0 ? (index > faces / 2 ? Math.PI / 2 : -Math.PI / 2) : 0,
          calculateXRotation(index),
          0
        );

        function calculateXRotation(index) {
          if (index % 3 == 1) {
            return index > faces / 2 ? Math.PI / 2 : -Math.PI / 2;
          }
          return 0;
        }
        group.add(tesseractUnit);
      }

      return group;
    }

    function createFullTesseract(params) {
      const group = new THREE.Group();
      for (let x = 0; x < 2; x++) {
        for (let y = 0; y < 2; y++) {
          for (let z = 0; z < 2; z++) {
            let tesseractBox = creatreTesseractScene(6, 30);
            tesseractBox.position.set(x * 60, y * 60, (z * 60));
            group.add(tesseractBox);
          }
        }
      }
      return group;
    }

    let item = createFullTesseract();
    test.scene.add(item);

    const items = [
      {
        angle: 0.002,
        position: 'Software Developer at almentor',
        date: 'Aug 2021 - Current',
        img: './assets/images/almentor.png',
        description:
          'part-time, Front end developer using angular 10 for 6 months and .net backend developer using .net',
        animation: 'none',
      },
      {
        angle: 0.002,
        position: `Private in Egyptian Army`,
        date: 'Oct 2021 - Dec 2022',
        img: './assets/images/nozom.png',
        description:
          'Front end developer using angular 10 for 6 months and .net backend developer using .net (Sep 2021- Current)',
        animation: 'salute',
      },
      {
        angle: 0.002,
        position: 'Software Engineer at Con|Tour',
        date: 'Oct 2020- Apr 2022',
        img: './assets/images/contour.png',
        animation: 'none',
      },
      {
        angle: 0.002,
        position: 'Front end developer at Schoolia',
        date: 'Aug 2021 - Current',
        img: './assets/images/schoolia.png',
        animation: 'none',
      },
      {
        angle: 0.002,
        position: 'Front end developer at Masarat Misr',
        date: 'Aug 2021 - ',
        img: './assets/images/Masarat.png',
        animation: 'none',
      },
      {
        angle: 0.002,
        position: 'Full Stack developer at ICareer',
        date: 'Aug 2021 - Current',
        img: './assets/images/icareer.png',
        animation: 'none',
      },
      {
        angle: 0.002,
        position: 'Front end developer at SubsBase',
        date: 'Aug 2021 - Current',
        img: './assets/images/subsbase.png',
        animation: 'none',
      },
      {
        angle: 0.002,
        position: 'Front end developer at 04Egypt',
        date: 'Aug 2021 - Current',
        img: './assets/images/04Egypt.png',
        animation: 'none',
      },
      {
        angle: 0.002,
        position: 'Software developer at Tafra',
        date: 'Aug 2021 - Current',
        img: './assets/images/tafra.png',
        animation: 'none',
      },
    ];

    let itemIndex = -1; //intitalize with -1 so increment to start with index 0
    const rotDegree = 0.0021;
    let scrolling = false;

    window.addEventListener(
      'wheel',
      async function (e) {
        // if (e.deltaY > 0 && itemIndex < items.length - 1 && !scrolling) {
        //   //scrolling down
        //   scrolling = true;
        //   $('#profile-body').fadeOut();
        //   itemIndex++;
        //   if (itemIndex == 0) {
        //     await reachEndurance();
        //     showRectangle(items[itemIndex]);
        //   } else {
        //     if (items[itemIndex - 1].animation != 'none') {
        //       await playAnimation(saluteAction).then(() => {
        //           moveForward().then(() => {
        //           showRectangle(items[itemIndex]);
        //         });
        //       });
        //     }
        //     else {
        //       await moveForward();
        //       showRectangle(items[itemIndex]);
        //     }
        //   }
        // } else if (e.deltaY < 0 && itemIndex > 0 && !scrolling) {
        //   scrolling = true;
        //   $('#profile-body').fadeOut();
        //   itemIndex--;
        //   if (items[itemIndex].animation != 'none') {
        //     await moveBackward().then(() => {
        //       playAnimation(saluteAction).then(() => {
        //       showRectangle(items[itemIndex]);
        //     });
        //   });
        //   }
        //   else {
        //     await moveBackward();
        //     showRectangle(items[itemIndex])
        //   };
        // }
      },
      true
    );

    function playAnimation(animation) {
      return new Promise((resolve, reject) => {
        flyingAction.stop();
        animation.play();
        animation.setLoop(true, 1);
        test.mixer.addEventListener('finished', function (e) {
          animation.stop();
          flyingAction.play();
          test.singleStepMode = false;
          resolve(true);
        });
      });
    }

    function reachEndurance() {
      return new Promise((resolve, reject) => {
        const tweenInterval = setInterval(() => {
          var astronautMovment = new TWEEN.Tween(astronautScene.position)
            .to(
              {
                x: -50,
                y: -30,
                z: -30,
              },
              5
            )
            .start();
          var astronautRotation = new TWEEN.Tween(astronautScene.rotation)
            .to(
              {
                y: Math.PI * 0.85,
              },
              5
            )
            .start();
          var cameraMovement = new TWEEN.Tween(test.camera.position)
            .to(
              {
                x: -50,
                y: -25,
                z: 0,
              },
              5
            )
            .start();

          TWEEN.update();
        }, 1);
        setTimeout(() => {
          clearInterval(tweenInterval);
          resolve(true);
        }, 5000);
      });
    }

    function moveForward() {
      return new Promise((resolve, reject) => {
        const rotationInterval = setInterval(() => {
          endurance.rotation.z += rotDegree;
        }, 1);
        setTimeout(() => {
          clearInterval(rotationInterval);
          resolve(true);
        }, 1000);
      });
    }

    function moveBackward() {
      return new Promise((resolve, reject) => {
        const rotationInterval = setInterval(() => {
          endurance.rotation.z -= rotDegree;
        }, 1);
        setTimeout(() => {
          clearInterval(rotationInterval);
          resolve(true);
        }, 1000);
      });
    }

    function showRectangle(item) {
      $('#profile-body_main-info_text_header').text(item.position);
      $('#profile-body_main-info_text_description').text(item.description);
      $('#profile-body_main-info_text_description_date').text(`(${item.date})`);
      $('#profile-body_main-info_image').attr('src', item.img);
      $('#profile-body').fadeIn();
      scrolling = false;
    }

    function calculateArmyDays() {}
    const loader = new FBXLoader();
    loader.load('./assets/astronaut/test.fbx', function (astronaut) {
      loader.load('./assets/astronaut/Salute.fbx', function (salute) {
        loader.load('./assets/astronaut/Flying.fbx', function (flying) {
          astronautScene = astronaut;
          astronaut.position.set(0, -5, 40);

          astronautScene.scale.set(0.04, 0.04, 0.04);

          astronautScene.animations.push(flying.animations[0]);

          astronautScene.animations.push(salute.animations[0]);

          test.mixer = new THREE.AnimationMixer(astronautScene);

          flyingAction = test.mixer.clipAction(astronautScene.animations[0]);
          saluteAction = test.mixer.clipAction(astronautScene.animations[1]);

          flyingAction.play();

          test.singleStepMode = false;
          test.scene.add(astronautScene);
        });
      });
    });

    const animate = () => {
      var mixerUpdateDelta = test.clock.getDelta();

      if (test.mixer) {
        test.mixer.update(mixerUpdateDelta);
      }

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
