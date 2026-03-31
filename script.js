let scene, camera, renderer, moleculeGroup;

init();
loadMolecule("methane");

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020617);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 6;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("canvas-container").appendChild(renderer.domElement);

  const light = new THREE.PointLight(0xffffff, 1.5);
  light.position.set(5, 5, 5);
  scene.add(light);

  moleculeGroup = new THREE.Group();
  scene.add(moleculeGroup);

  animate();
}

/* Helpers */
function createAtom(color, size, pos) {
  const geo = new THREE.SphereGeometry(size, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.2
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...pos);
  moleculeGroup.add(mesh);
}

function createBond(a, b) {
  const mat = new THREE.LineBasicMaterial({ color: 0xffffff });
  const points = [
    new THREE.Vector3(...a),
    new THREE.Vector3(...b)
  ];
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  moleculeGroup.add(new THREE.Line(geo, mat));
}

/* Molecules */
function loadMolecule(type) {
  while (moleculeGroup.children.length > 0) {
    moleculeGroup.remove(moleculeGroup.children[0]);
  }

  if (type === "methane") {
    const c = [0,0,0];
    createAtom(0x222222, 0.35, c);

    const H = [
      [1,1,1], [-1,-1,1], [-1,1,-1], [1,-1,-1]
    ];

    H.forEach(h => {
      createAtom(0x00d4ff, 0.2, h);
      createBond(c, h);
    });
  }

  if (type === "co2") {
    const c = [0,0,0];
    const o1 = [2,0,0];
    const o2 = [-2,0,0];

    createAtom(0x222222, 0.35, c);
    createAtom(0xff3b3b, 0.3, o1);
    createAtom(0xff3b3b, 0.3, o2);

    createBond(c, o1);
    createBond(c, o2);
  }

  if (type === "benzene") {
    const radius = 2;
    const atoms = [];

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      atoms.push([x, y, 0]);
      createAtom(0x222222, 0.3, [x, y, 0]);
    }

    for (let i = 0; i < 6; i++) {
      createBond(atoms[i], atoms[(i+1)%6]);
    }
  }
}

/* Animation */
function animate() {
  requestAnimationFrame(animate);
  moleculeGroup.rotation.y += 0.01;
  moleculeGroup.rotation.x += 0.003;
  renderer.render(scene, camera);
}

/* Resize */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
