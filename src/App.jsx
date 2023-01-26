import { useEffect } from 'react';
import ReactDOM from 'react-dom'

import * as THREE from 'three';
import * as $ from 'jquery';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import SceneInit from './lib/SceneInit';
import { items, achievements } from './lib/data';
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';
import typer from 'typer-js';


function App() {
  useEffect(() => {
    const main = new SceneInit('myThreeJsCanvas');
    main.initialize();
    main.animate();
    let loaded = false;
    setTimeout(() => {
      loaded = true;
    }, 10500);

    ReactDOM.render(
      <div>
        {items.map((item, index) => {
          return (
            <div className="profile-body" id={`profile-body-${index}`} key={`body-${index}`}>
              <div className="profile-body_work-items" style={{ width: "80%" }}>
                <div className="container mt-2 mb-5" style={{ height: "inherit" }}>
                  <img id="profile-body_main-info_image" className="profile-body_main-info_image" src={item.img} />
                  <div className="col-12">

                    <div className="profile-body_main-info_text" style={{ height: "max-content" }}>
                      <p className="profile-body_main-info_text_header">
                        {item.position}
                        <span className="profile-body_main-info_text_date" >
                          {item.date}
                        </span>
                      </p>
                      <ul className="profile-body_main-info_text_description">
                        {item.description.map((desc) => {
                          return (<li key={desc}>
                            {desc}
                          </li>)

                        })}
                      </ul>


                    </div>

                  </div>
                </div>
              </div>


            </div>
          );
        })}
      </div>
      , document.getElementById('profile'));

    ReactDOM.render(
      <div>
        {achievements.map((item, index) => {
          return (
            <div className="profile-body" id={`profile-achievments-${index}`} key={`achievments-${index}`}>
              <div className="profile-body_work-items profile-body_achievments" style={{ width: "80%" }}>
                <div className="container" style={{ height: "inherit" }}>
                  <div className="row justify-content-space-between align-items-center" style={{ height: "inherit" }}>
                    <div className="profile-body_main-info_text" style={{ height: "max-content" }}>

                      <span className="profile-body_main-info_text_description" id="profile-body_achievments_text_description">
                        {item.title}
                      </span>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      , document.getElementById('profile-achievments'));



    // be sure to call sync() after all properties are set to update the rendering:
    var endurance;
    var tars;
    const glftLoader = new GLTFLoader();
    const fbxLoader = new FBXLoader();
    var flyingAction = null;
    var saluteAction = null;
    var astronautScene = null;

    let itemIndex = -1; //intitalize with -1 so increment to start with index 0
    const rotDegree = 0.0021;
    let scrolling = false;

    function finishBooting() {
      $('#boot-data').remove();
      $('#loading-profile-body').css('visibility', 'visible');
      typer('#loading-profile-body_main-info_text')
        .line('Mohamed Mostafa Mostafa')
        .line('Bachelor of Computer Engineering , NU(2021)')
        .line('+4 years of expeirnce as front end developer')
        .line('+13 projects done')
        .line('1 Research Publication')
        .end(true, function () {
          $('.loading-profile-body_main-info_social-icons').css('visibility', 'visible');
          $('#loading-profile-body_main-info_img').addClass('loading-profile-body_main-info_image-colored');
  
          setTimeout(() => {
            $('.loading-profile-body_main-info').toggle('explode');
          }, 2000);
        });
      $('#myThreeJsCanvas').css("visibility", "visible");
    }


    let tesseractTexture = new THREE.TextureLoader().load(
      '../../assets/tesseract/textures/material.png'
    );

    let tesseractTextures = achievements.map(item => {
      let itemTexture = new THREE.TextureLoader().load(
        `../../assets/images/${item.images[0]}}`
      );
      let itemMaterial = new THREE.MeshPhongMaterial({
        map: itemTexture,
      });
      return itemMaterial;
    });

    let tesseractBoxMaterial = new THREE.MeshPhongMaterial({
      map: tesseractTexture,
    });
    let tesseractBoxMaterial2 = new THREE.MeshBasicMaterial({
      color: '0x223355'
    });

    glftLoader.load('./assets/shiba/scene.gltf', (gltfScene) => {
      endurance = gltfScene.scene;

      endurance.rotation.x = (90 * Math.PI) / 180;
      endurance.position.set(-25, -25, -100);
      main.scene.add(endurance);
    });

    glftLoader.load('./assets/tars/scene.gltf', (gltfScene) => {
      tars = gltfScene.scene;

      tars.position.set(0, -800, 0);
      tars.scale.set(5, 5, 5);
      main.scene.add(tars);
    });

    function createTesseractUnit(faces, boxWidth, boxHeight) {

      let BoxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, 0);
      const box = new THREE.Mesh(BoxGeometry, tesseractTextures[0]);
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
      TesseractUnitGroup.add(box);
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

    function createFullTesseract(cubeLength, unitLength) {
      const group = new THREE.Group();
      for (let x = 0; x < cubeLength; x++) {
        for (let y = 0; y < cubeLength; y++) {
          for (let z = 0; z < cubeLength; z++) {
            let tesseractBox = creatreTesseractScene(6, unitLength * 1.5);
            tesseractBox.position.set(
              x * unitLength * 3,
              y * unitLength * 3,
              z * unitLength * 3
            );
            group.add(tesseractBox);
          }
        }
      }


      for (let coreIndex = 0; coreIndex < achievements.length; coreIndex++) {
        let tesseractCoreBox = creatreTesseractScene(6, unitLength * 1.5);
        tesseractCoreBox.name = 'core';
        tesseractCoreBox.position.set(
          (cubeLength * unitLength * 3) / 2 - unitLength * 1.5,
          cubeLength * unitLength * 3 + (coreIndex * unitLength * 3),
          (cubeLength * unitLength * 3) / 2 - unitLength * 1.5
        );
        group.add(tesseractCoreBox);
      }
      return group;
    }

    function addTesseractImage(imgPath) {
      let imageTexture = new THREE.TextureLoader().load(
        `../../assets/images/${imgPath}`
      );
      let imageMAterial = new THREE.MeshPhongMaterial({
        map: imageTexture,
      });
      let ImageGeometry = new THREE.BoxGeometry(20, 20, 0);
      const box = new THREE.Mesh(ImageGeometry, imageMAterial);
      return box;
    }

    function animateImage(image, position, i, j, l) {
      image.position.y += (60 * i)
      image.position.z = position.z - 30 - 300;
      image.position.x = position.x;
    }

    function createBlackHole(r) {
      const ringGeometry = new THREE.RingGeometry(r, r * 1.5, r * 1.5);
      const ring2Geometry = new THREE.RingGeometry(r, r * 2.25, r * 2.25);
      let sunTexture = new THREE.TextureLoader().load(
        `../../assets/textures/sun.png`
      );
      let sunMaterial = new THREE.MeshPhongMaterial({
        map: sunTexture,
        side: THREE.DoubleSide,
      });

      const sphereGeometry = new THREE.SphereGeometry(r, r * 1.5, r * 1.5);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeometry, sunMaterial);
      const ring2 = new THREE.Mesh(ring2Geometry, sunMaterial);
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      ring2.rotation.y += (70 * Math.PI) / 180;
      ring2.rotation.x += (80 * Math.PI) / 180;
      let group = new THREE.Group();
      group.rotation.z += Math.PI / 2;

      group.add(ring, ring2, sphere)
      return group;
    }

    let item = createFullTesseract(2, 20);
    main.scene.add(item);
    item.position.set(0, -500, -300);
    const coreItem = item.children.filter((i) => i.name == 'core')[0];

    function sumPositions(...objs) {
      return objs.reduce((a, b) => {
        for (let k in b) {
          if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
        }
        return a;
      }, {});
    }

    achievements.forEach((story, i) => {
      story.images.forEach((image, j) => {
        const imgBox = addTesseractImage(image);
        imgBox.position.set(
          sumPositions(item.position, coreItem.position).x,
          sumPositions(item.position, coreItem.position).y,
          sumPositions(item.position, coreItem.position).z
        );
        main.scene.add(imgBox);
        animateImage(imgBox, coreItem.position, i, j + 1, story.images.length);
      });
    });


    let blackhole = createBlackHole(40);
    blackhole.position.set(0, -150, -200);
    main.scene.add(blackhole);

    let played = false;

    var audio = new Audio('../../assets/audio/Interstellar Main Theme.mp3');

    window.addEventListener(
      'wheel',
      async function (e) {
        // if (!played) {
        //   audio.play();
        // }
        if (itemIndex < items.length - 1) {
          if (e.deltaY > 0 && !scrolling) {
            //scrolling down
            scrolling = true;
            $('.profile-body').fadeOut();
            itemIndex++;
            if (itemIndex == 0) {
              await reachEndurance(1500);
              showRectangle(itemIndex);
            } else {
              if (items[itemIndex - 1].animation != 'none') {
                await playAnimation(saluteAction).then(() => {
                  moveForward().then(() => {
                    showRectangle(itemIndex);
                  });
                });
              } else {
                await moveForward();
                showRectangle(itemIndex);
              }
            }
          } else if (e.deltaY < 0 && itemIndex > 0 && !scrolling) {
            scrolling = true;
            $('.profile-body').fadeOut();
            itemIndex--;
            if (items[itemIndex].animation != 'none') {
              await moveBackward().then(() => {
                playAnimation(saluteAction).then(() => {
                  showRectangle(itemIndex);
                });
              });
            } else {
              await moveBackward();
              showRectangle(itemIndex);
            }
          }
        } else {
          if (e.deltaY > 0 && !scrolling) {
            scrolling = true;
            $('.profile-body').fadeOut();
            if (itemIndex == items.length - 1) {
              audio.pause();
              await reachBlackHole(2000);
              await reachTesseract(1000);
              // audio.play();
              showRectangleAchievments(0)
              itemIndex++;
            }
            else {
              if (itemIndex < items.length + achievements.length - 1) {
                await moveForwardTesseract(itemIndex - items.length + 1, 900);
                await showRectangleAchievments(itemIndex - items.length + 1);
                itemIndex++;
              }
              else {
                if (itemIndex < items.length + achievements.length) {
                  await reachTars(3000);
                  setTimeout(() => {
                    showRectangleProjects();
                    itemIndex++;
                  }, 500);
                }
                else if (itemIndex < items.length + achievements.length + 1) {
                  $('#projects').fadeOut();
                  setTimeout(() => {
                    showRectangleTechSkills();
                    itemIndex++;
                  }, 500);
                }
              }
            }
          }
          else if (e.deltaY < 0 && !scrolling) {
            scrolling = true;
            $('.profile-body').fadeOut();
            if (itemIndex == items.length - 1) {
              audio.pause();
              await reachBlackHole(2000);
              await reachEndurance(1500);
              // audio.play();
              itemIndex--;
            }
            else {
              await moveForwardTesseract(itemIndex - items.length - 1, 900);
              await showRectangleAchievments(itemIndex - items.length - 1)
              itemIndex--;
            }
          }
        }
      },
      true
    );

    function playAnimation(animation) {
      return new Promise((resolve, reject) => {
        flyingAction.stop();
        animation.play();
        animation.setLoop(true, 1);
        main.mixer.addEventListener('finished', function (e) {
          animation.stop();
          flyingAction.play();
          main.singleStepMode = false;
          resolve(true);
        });
      });
    }

    function reachEndurance(speed) {
      return new Promise((resolve, reject) => {
        new TWEEN.Tween(astronautScene.position)
          .to(
            {
              x: -50,
              y: -35,
              z: -30,
            },
            speed
          )
          .start();

        new TWEEN.Tween(astronautScene.rotation)
          .to(
            {
              y: Math.PI * 0.85,
            },
            speed
          )
          .start();
        new TWEEN.Tween(main.camera.position)
          .to(
            {
              x: -50,
              y: -25,
              z: 0,
            },
            speed
          ).onComplete(e => {
            resolve(true)
          })
          .start()
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

    function moveForwardTesseract(num, speed) {
      return new Promise((resolve, reject) => {

        let target = -500 + 225 - (60 * (num));
        let cameraTaget = -500 + 230 - (60 * (num))
        new TWEEN.Tween(astronautScene.position)
          .to(
            {
              y: target,
            },
            speed
          )
          .start();
        new TWEEN.Tween(main.camera.position)
          .to(
            {
              y: cameraTaget,
            },
            speed
          )
          .start().onComplete(e => {
            resolve(true)
          });
      });
    }

    function showRectangleAchievments(num) {
      const reversedindex = achievements.length - num - 1;
      $(`#profile-achievments-${reversedindex}`).fadeIn();
      scrolling = false;
    }

    function showRectangle(index) {
      $(`#profile-body-${index}`).fadeIn();
      scrolling = false;
    }

    function reachBlackHole(speed) {
      return new Promise((resolve, reject) => {
        var astronautMovment = new TWEEN.Tween(astronautScene.position)
          .to(
            {
              x: 0,
              y: -150,
              z: -180,
            },
            speed
          )
          .start();

        var cameraMovement = new TWEEN.Tween(main.camera.position)
          .to(
            {
              x: 0,
              y: -150,
              z: -140,
            },
            speed
          ).onComplete(e => {
            resolve(true)
          })
          .start();
      }, 1);

    }

    function reachTesseract(speed) {
      return new Promise((resolve, reject) => {
        var astronautMovment = new TWEEN.Tween(astronautScene.position)
          .to(
            {
              x: 30,
              y: -500 + 225,
              z: -270,
            },
            speed
          )
          .start();

        var cameraMovement = new TWEEN.Tween(main.camera.position)
          .to(
            {
              x: 30,
              y: -500 + 230,
              z: -250,
            },
            speed
          ).onComplete(e => {
            resolve(true)
          })
          .start();
      }, 1);

    }

    function reachTars(speed) {
      return new Promise((resolve, reject) => {

        var cameraMovement = new TWEEN.Tween(main.camera.position)
          .to(
            {
              x: 0,
              y: -800,
              z: 50,
            },
            speed
          ).onComplete(e => {
            resolve(true)
          })
          .start();
      }, 1);

    }

    function showRectangleProjects() {
      $(`#projects`).fadeIn();
      scrolling = false;
    }

    function showRectangleTechSkills() {
      $(`#tech-skills`).fadeIn();
      scrolling = false;
    }

    const loader = new FBXLoader();
    loader.load('./assets/astronaut/test.fbx', function (astronaut) {
      loader.load('./assets/astronaut/Salute.fbx', function (salute) {
        loader.load('./assets/astronaut/Flying.fbx', function (flying) {
        
          astronautScene = astronaut;
          astronaut.position.set(0, -5, 40);

          astronautScene.scale.set(0.04, 0.04, 0.04);

          astronautScene.animations.push(flying.animations[0]);

          astronautScene.animations.push(salute.animations[0]);

          main.mixer = new THREE.AnimationMixer(astronautScene);

          flyingAction = main.mixer.clipAction(astronautScene.animations[0]);
          saluteAction = main.mixer.clipAction(astronautScene.animations[1]);

          flyingAction.play();

          main.singleStepMode = false;
          main.scene.add(astronautScene);
        });
      });
    });

    const animate = () => {
      var mixerUpdateDelta = main.clock.getDelta();

      if (main.mixer) {
        main.mixer.update(mixerUpdateDelta);
      }
      TWEEN.update();

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
