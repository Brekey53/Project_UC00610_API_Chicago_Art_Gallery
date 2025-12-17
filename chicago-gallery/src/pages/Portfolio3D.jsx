import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Image,
  Text,
  Environment,
  useCursor,
  MeshReflectorMaterial,
  PointerLockControls,
} from "@react-three/drei";
import * as THREE from "three";

// Componente para cada Quadro com moldura
function Frame({ url, position, rotation, title, ...props }) {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  useCursor(hovered); // Muda o cursor para pointer ao passar por cima

  // Animação suave ao passar o rato (escala aumenta ligeiramente)
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.scale.x = THREE.MathUtils.lerp(
        ref.current.scale.x,
        hovered ? 1.2 : 1,
        0.1
      );
      ref.current.scale.y = THREE.MathUtils.lerp(
        ref.current.scale.y,
        hovered ? 1.2 : 1,
        0.1
      );
    }
  });

  return (
    <group position={position} rotation={rotation} {...props}>
      {/* Moldura do quadro */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[1.1, 1.5, 0.05]} />
        <meshStandardMaterial color="#DAA520" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Foco de Luz na Obra */}
      <spotLight
        position={[0, 2, 1.5]}
        angle={0.6}
        penumbra={0.5}
        intensity={5}
        distance={8}
        color="#fff5e6"
      />

      {/* A Imagem da obra */}
      <Image
        ref={ref}
        url={url}
        transparent
        side={THREE.DoubleSide}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        scale={[1, 1.4, 1]} // Proporção vertical
      />

      {/* Placa com o título */}
      <mesh position={[0, -0.85, 0]}>
        <planeGeometry args={[0.8, 0.15]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <Text
        position={[0, -0.85, 0.01]}
        fontSize={0.06}
        color="black"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.7}
      >
        {title.length > 20 ? title.substring(0, 20) + "..." : title}
      </Text>
    </group>
  );
}

// Componente para Candeeiro Antigo
function Lamp({ position }) {
  return (
    <group position={position}>
      {/* Fio */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Abajur */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.4, 0.2, 32, 1, true]} />
        <meshStandardMaterial
          color="#f5f5dc"
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Luz Quente */}
      <pointLight
        intensity={2}
        distance={10}
        decay={2}
        color="#ffaa00"
        position={[0, -0.2, 0]}
      />
    </group>
  );
}

// Componente para Banco de Museu (Cadeirão)
function Bench({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Assento estofado */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[2.5, 0.4, 1]} />
        <meshStandardMaterial color="#7a1f1f" roughness={0.8} />
      </mesh>
      {/* Pés */}
      <mesh position={[1.1, 0.2, 0.35]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>
      <mesh position={[-1.1, 0.2, 0.35]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>
      <mesh position={[1.1, 0.2, -0.35]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>
      <mesh position={[-1.1, 0.2, -0.35]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#2c2c2c" />
      </mesh>
    </group>
  );
}

// Componente para Barreira de Proteção
function Barrier({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8]} />
        <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

// --- SISTEMA DE SOM (Sintetizador Simples) ---
let sharedAudioCtx;
const getAudioContext = () => {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return sharedAudioCtx;
};

const playSound = (type) => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    
    if (type === "shoot") {
      osc.type = "square";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "hit") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "powerup") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "slowmo") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 1.5); // Som de "descida" longo
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 1.5);
      osc.start(now);
      osc.stop(now + 1.5);
    }
  } catch (e) {
    console.error("Audio error", e);
  }
};

// Componente de Música de Ação (Procedural)
function ActionMusic() {
  useEffect(() => {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.15; // Volume baixo (Background)
    masterGain.connect(ctx.destination);

    let isPlaying = true;
    let nextTime = ctx.currentTime + 0.1;
    let beat = 0;

    const schedule = () => {
      if (!isPlaying) return;

      // Agendar notas para os próximos 100ms
      while (nextTime < ctx.currentTime + 0.1) {
        const t = nextTime;

        // Kick (Batida forte a cada 4 tempos)
        if (beat % 4 === 0) {
          const osc = ctx.createOscillator();
          osc.frequency.setValueAtTime(150, t);
          osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.5);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.8, t);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(t);
          osc.stop(t + 0.5);
        }

        // Bass (Linha de baixo "Action" em contratempo)
        if (beat % 4 === 2) {
          const osc = ctx.createOscillator();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(60, t);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.4, t);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(t);
          osc.stop(t + 0.2);
        }

        // Hi-hats (Ritmo rápido)
        if (beat % 2 !== 0) {
          const osc = ctx.createOscillator();
          osc.type = "square";
          osc.frequency.setValueAtTime(800, t);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.05, t);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(t);
          osc.stop(t + 0.05);
        }

        nextTime += 0.12; // ~125 BPM
        beat++;
      }
      setTimeout(schedule, 25);
    };

    schedule();

    return () => {
      isPlaying = false;
      masterGain.disconnect();
    };
  }, []);

  return null;
}

// --- COMPONENTES DO JOGO (EASTER EGG) ---

function ForbiddenButton({ onClick }) {
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  return (
    <group position={[4, -2, 20]} rotation={[0, -Math.PI / 4, 0]}>
      {/* Pedestal */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Botão Vermelho */}
      <mesh
        position={[0, 1.05, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <cylinderGeometry args={[0.1, 0.15, 0.1]} />
        <meshStandardMaterial
          color="red"
          emissive="red"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Placa de Aviso */}
      <group position={[0, 0.8, 0.26]}>
        <mesh>
          <planeGeometry args={[0.6, 0.3]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <Text position={[0, 0, 0.01]} fontSize={0.08} color="red">
          NÃO CARREGAR
        </Text>
      </group>
    </group>
  );
}

// Componente Inimigo com Animação
function Stickman({ position, isBoss }) {
  const group = useRef();
  const { camera } = useThree();

  useFrame((state) => {
    if (group.current) {
      // Sincronizar posição visual com a lógica
      group.current.position.copy(position);
      // Olhar para o jogador
      group.current.lookAt(camera.position.x, 0, camera.position.z);
      
      // Animação de andar (pernas)
      const t = state.clock.elapsedTime * 15;
      group.current.children[3].rotation.x = Math.sin(t) * 0.8; // Perna Esq
      group.current.children[4].rotation.x = Math.sin(t + Math.PI) * 0.8; // Perna Dir
    }
  });

  return (
    <group ref={group} position={position}>
      {/* Cabeça */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color={isBoss ? "#8b0000" : "black"} />
      </mesh>
      {/* Corpo */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial color={isBoss ? "#8b0000" : "black"} />
      </mesh>
      {/* Braços */}
      <mesh position={[0, 1.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 1]} />
        <meshStandardMaterial color={isBoss ? "#8b0000" : "black"} />
      </mesh>
      {/* Pernas */}
      <mesh position={[-0.2, 0.5, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial color={isBoss ? "#8b0000" : "black"} />
      </mesh>
      <mesh position={[0.2, 0.5, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial color={isBoss ? "#8b0000" : "black"} />
      </mesh>
      {/* Arma Inimiga */}
      <mesh position={[0.4, 1.4, 0.2]}>
        <boxGeometry args={[0.1, 0.1, 0.4]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  );
}

// Componente Arma do Jogador com Recuo
function PlayerGun({ isShooting }) {
  const gunRef = useRef();
  
  useFrame((state, delta) => {
    if (gunRef.current) {
      // Posição base da arma
      const basePos = new THREE.Vector3(0.3, -0.3, -0.5);
      // Posição de recuo
      const recoilPos = new THREE.Vector3(0.3, -0.25, -0.3);
      
      // Interpolação para simular o coice da arma
      const target = isShooting ? recoilPos : basePos;
      gunRef.current.position.lerp(target, 20 * delta);
    }
  });

  return (
    <mesh ref={gunRef} position={[0.3, -0.3, -0.5]} parent={null}>
      <boxGeometry args={[0.1, 0.1, 0.4]} />
      <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      {/* Mira Laser */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.4]} />
        <meshStandardMaterial color="red" emissive="red" />
      </mesh>
    </mesh>
  );
}

// Componente PowerUp (Vida ou Escudo)
function PowerUp({ position, type }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.05;
      ref.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  return (
    <group ref={ref} position={position}>
      {type === "health" ? (
        <mesh>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.8} />
        </mesh>
      ) : type === "shield" ? (
        <mesh>
          <octahedronGeometry args={[0.2]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.8} />
        </mesh>
      ) : (
        // Slow Motion (Roxo)
        <mesh>
          <dodecahedronGeometry args={[0.2]} />
          <meshStandardMaterial color="#9932cc" emissive="#9932cc" emissiveIntensity={0.8} />
        </mesh>
      )}
    </group>
  );
}

function EasterEggGame({ onGameOver, setShootingAnim, onScoreUpdate, onStatsUpdate, currentScore }) {
  const { camera } = useThree();
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]); // Alterado para array de inimigos
  const [particles, setParticles] = useState([]); // Estado para partículas de explosão
  const [powerUps, setPowerUps] = useState([]); // Estado para powerups no chão
  const lastShot = useRef(0);
  const playerHealthRef = useRef(100); // Usar ref para acesso rápido no loop
  const playerShieldRef = useRef(0); // Escudo do jogador
  const timeScaleRef = useRef(1.0); // Controlo de tempo (Slow Motion)
  const bossSpawnedRef = useRef(false); // Flag para saber se o boss já apareceu

  // Loop do Jogo
  useFrame((state, delta) => {
    // Aplicar Slow Motion ao delta do jogo (movimento e lógica)
    const dt = delta * timeScaleRef.current;

    // Calcular número máximo de inimigos com base no score
    let maxEnemies = 1;
    if (currentScore >= 3000) {
      maxEnemies = 2;
      let threshold = 12000;
      while (currentScore >= threshold) {
        maxEnemies++;
        threshold *= 2;
      }
    }

    // 1. Spawnar inimigo se não houver
    // Verificar se deve spawnar o BOSS (Score >= 500)
    if (currentScore >= 500 && !bossSpawnedRef.current) {
      bossSpawnedRef.current = true;
      setEnemies((prev) => [
        ...prev,
        {
          position: new THREE.Vector3(0, -2, -30), // Nasce mais longe
          id: Date.now(),
          isBoss: true,
          hp: 200, // Boss tem mais vida
          spawnTime: state.clock.elapsedTime,
          lastShot: 0,
        },
      ]);
    }

    // Spawnar inimigos normais se não atingiu o limite
    const normalEnemiesCount = enemies.filter((e) => !e.isBoss).length;
    if (normalEnemiesCount < maxEnemies && Math.random() < 0.02) {
      const x = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 40;
      setEnemies((prev) => [
        ...prev,
        {
          position: new THREE.Vector3(x, -2, z),
          id: Date.now() + Math.random(),
          isBoss: false,
          hp: 10,
          spawnTime: state.clock.elapsedTime,
          lastShot: 0,
        },
      ]);
    }

    // 2. Movimento do Inimigo (Perseguir Jogador)
    enemies.forEach((enemy) => {
      const dirToPlayer = new THREE.Vector3().subVectors(camera.position, enemy.position);
      dirToPlayer.y = 0; // Manter no chão
      dirToPlayer.normalize();
      
      // Velocidade do inimigo (Boss é mais lento)
      const speed = enemy.isBoss ? 1.5 : 2.5;
      enemy.position.add(dirToPlayer.multiplyScalar(speed * dt));
    });

    // 3. Inimigo dispara contra o jogador
    enemies.forEach((enemy) => {
      // Delay inicial de 0.5s após spawnar antes de começar a disparar
      const canShoot = state.clock.elapsedTime - enemy.spawnTime > 0.5;

      if (canShoot && state.clock.elapsedTime - enemy.lastShot > (enemy.isBoss ? 1.0 : 1.5)) {
        enemy.lastShot = state.clock.elapsedTime;
        const enemyHead = enemy.position
          .clone()
          .add(new THREE.Vector3(0, 1.7, 0));
        const dir = new THREE.Vector3()
          .subVectors(camera.position, enemyHead)
          .normalize();

        playSound("shoot");
        setBullets((prev) => [
          ...prev,
          {
            pos: enemyHead,
            vel: dir.multiplyScalar(0.4), // Balas mais rápidas
            owner: "enemy",
            id: Math.random(),
          },
        ]);
      }
    });

    // 4. Atualizar Balas e Colisões
    setBullets((prev) => {
      const nextBullets = [];
      prev.forEach((b) => {
        // Movimento da bala afetado pelo Slow Motion
        b.pos.add(b.vel.clone().multiplyScalar(timeScaleRef.current));

        let hit = false;
        // Colisão Bala Inimiga -> Jogador
        if (b.owner === "enemy" && b.pos.distanceTo(camera.position) < 0.5) {
          let damage = 10;
          // Absorver dano com escudo se existir
          if (playerShieldRef.current > 0) {
            const absorb = Math.min(playerShieldRef.current, damage);
            playerShieldRef.current -= absorb;
            damage -= absorb;
          }
          playerHealthRef.current -= damage;
          playSound("hit");
          if (onStatsUpdate) onStatsUpdate(playerHealthRef.current, playerShieldRef.current, true);
          hit = true;
          if (playerHealthRef.current <= 0) onGameOver();
        }
        // Colisão Bala Jogador -> Inimigo
        else if (b.owner === "player") {
          // Verificar colisão com todos os inimigos
          for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            const enemyCenter = enemy.position.clone().add(new THREE.Vector3(0, 1.2, 0));
            
            if (b.pos.distanceTo(enemyCenter) < 1) {
              enemy.hp -= 10;
              hit = true;
              playSound("hit");

              if (enemy.hp <= 0) {
                enemy.dead = true; // Marcar para remoção
                onScoreUpdate(enemy.isBoss ? 1000 : 100);

                // Gerar Partículas de Explosão
                const newParticles = [];
                for (let j = 0; j < (enemy.isBoss ? 50 : 20); j++) {
                  newParticles.push({
                    pos: enemy.position.clone().add(new THREE.Vector3(0, 1, 0)),
                    vel: new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5))
                      .normalize()
                      .multiplyScalar(2 + Math.random() * 3),
                    id: Math.random(),
                    life: 1.0,
                  });
                }
                setParticles((prev) => [...prev, ...newParticles]);

                // Drop PowerUp
                if (Math.random() < 0.3 || enemy.isBoss) {
                  const rand = Math.random();
                  let type = "health";
                  if (rand > 0.6) type = "slowmo";
                  else if (rand > 0.3) type = "shield";

                  setPowerUps((prev) => [
                    ...prev,
                    {
                      pos: enemy.position.clone().add(new THREE.Vector3(0, 0.5, 0)),
                      type,
                      id: Math.random(),
                    },
                  ]);
                }
              }
              break; // Bala atinge apenas um inimigo
            }
          }
        }

        // Manter bala se não bateu e não foi longe demais
        if (!hit && b.pos.distanceTo(camera.position) < 50) {
          nextBullets.push(b);
        }
      });
      return nextBullets;
    });

    // Remover inimigos mortos
    setEnemies((prev) => {
      const alive = prev.filter((e) => !e.dead);
      if (alive.length !== prev.length) return alive;
      return prev;
    });

    // 5. Atualizar Partículas
    setParticles(prev => prev.map(p => ({
      ...p,
      pos: p.pos.clone().add(p.vel.clone().multiplyScalar(dt)),
      life: p.life - dt * 2 // Desaparecer ao longo do tempo
    })).filter(p => p.life > 0));

    // 6. Colisão com PowerUps
    setPowerUps(prev => {
      const next = [];
      let changed = false;
      prev.forEach(p => {
        if (p.pos.distanceTo(camera.position) < 2.5) {
          if (p.type === "health") {
            playSound("powerup");
            playerHealthRef.current = Math.min(100, playerHealthRef.current + 30);
          } else if (p.type === "shield") {
            playSound("powerup");
            playerShieldRef.current = Math.min(100, playerShieldRef.current + 50);
          } else {
            // Slow Motion
            playSound("slowmo");
            timeScaleRef.current = 0.2; // Abranda o tempo para 20%
            setTimeout(() => { timeScaleRef.current = 1.0; }, 5000); // Dura 5 segundos
          }
          if (onStatsUpdate) onStatsUpdate(playerHealthRef.current, playerShieldRef.current, false);
          changed = true;
        } else {
          next.push(p);
        }
      });
      return changed ? next : prev;
    });
  });

  // Disparo do Jogador
  useEffect(() => {
    const handleMouseDown = () => {
      playSound("shoot");
      setShootingAnim(true);
      setTimeout(() => setShootingAnim(false), 100); // Reset animação recuo

      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const pos = camera.position.clone().add(dir.multiplyScalar(0.5));
      setBullets((prev) => [
        ...prev,
        {
          pos,
          vel: dir.multiplyScalar(1.5), // Tiro do jogador muito rápido
          owner: "player",
          id: Math.random(),
        },
      ]);
    };
    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, [camera, setShootingAnim]);

  return (
    <>
      {/* Música de Fundo */}
      <ActionMusic />

      {enemies.map((enemy) => (
        <Stickman key={enemy.id} position={enemy.position} isBoss={enemy.isBoss} />
      ))}
      {bullets.map((b) => (
        <mesh key={b.id} position={b.pos} rotation={new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.vel.clone().normalize()))}>
          <cylinderGeometry args={[0.02, 0.02, 0.6]} />
          <meshStandardMaterial
            color={b.owner === "player" ? "yellow" : "red"}
            emissive={b.owner === "player" ? "yellow" : "red"}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
      {/* Renderizar Partículas */}
      {particles.map((p) => (
        <mesh key={p.id} position={p.pos}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="orange" emissive="red" emissiveIntensity={2} transparent opacity={p.life} />
        </mesh>
      ))}
      {/* Renderizar PowerUps */}
      {powerUps.map(p => <PowerUp key={p.id} position={p.pos} type={p.type} />)}
    </>
  );
}

// Componente para Movimento do Jogador (WASD)
function Player({ isLocked, selectedArtwork }) {
  const { camera } = useThree();
  const [move, setMove] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false, // Estado para o dash
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          setMove((m) => ({ ...m, forward: true }));
          break;
        case "KeyS":
        case "ArrowDown":
          setMove((m) => ({ ...m, backward: true }));
          break;
        case "KeyA":
        case "ArrowLeft":
          setMove((m) => ({ ...m, left: true }));
          break;
        case "KeyD":
        case "ArrowRight":
          setMove((m) => ({ ...m, right: true }));
          break;
        case "ShiftLeft":
        case "ShiftRight":
          setMove((m) => ({ ...m, shift: true }));
          break;
      }
    };
    const handleKeyUp = (e) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          setMove((m) => ({ ...m, forward: false }));
          break;
        case "KeyS":
        case "ArrowDown":
          setMove((m) => ({ ...m, backward: false }));
          break;
        case "KeyA":
        case "ArrowLeft":
          setMove((m) => ({ ...m, left: false }));
          break;
        case "KeyD":
        case "ArrowRight":
          setMove((m) => ({ ...m, right: false }));
          break;
        case "ShiftLeft":
        case "ShiftRight":
          setMove((m) => ({ ...m, shift: false }));
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!isLocked && !selectedArtwork) return; // Só mexe se estiver focado ou a ver detalhes
    const speed = (move.shift ? 15 : 5) * delta; // Velocidade aumenta com Shift (Dash)
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(
      0,
      0,
      (move.backward ? 1 : 0) - (move.forward ? 1 : 0)
    );
    const sideVector = new THREE.Vector3(
      (move.left ? 1 : 0) - (move.right ? 1 : 0),
      0,
      0
    );

    const velocity = direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(camera.rotation);

    // --- Sistema de Colisão ---
    const newPos = camera.position.clone().add(velocity);

    // 1. Paredes do Corredor (Largura 10 -> Limite +/- 4)
    if (newPos.x < -4 || newPos.x > 4) velocity.x = 0;

    // 2. Fim do Corredor (Comprimento 50 -> Limite +/- 24)
    if (newPos.z < -24 || newPos.z > 24) velocity.z = 0;

    // 3. Bancos Centrais (Z = -10, 0, 10 | Tamanho aprox: X:2.5, Z:1)
    // Caixa de colisão: X entre -1.5 e 1.5, Z +/- 1 do centro do banco
    const benchZones = [-15, -5, 5, 15];
    const hitBench = benchZones.some(
      (benchZ) =>
        newPos.x > -1.5 &&
        newPos.x < 1.5 &&
        newPos.z > benchZ - 1 &&
        newPos.z < benchZ + 1
    );

    // Se bater num banco, para o movimento (simples)
    if (hitBench) velocity.set(0, 0, 0);

    camera.position.add(velocity);
    camera.position.y = 0; // Altura dos olhos fixa (nivelada com os quadros)
  });
  return null;
}

// Componente que deteta proximidade das obras
function ProximityHandler({ artworks, setArtwork }) {
  const { camera } = useThree();
  const width = 10;
  const lastLookedAt = useRef(null);
  const timer = useRef(0);

  useFrame((state, delta) => {
    let closest = null;
    let minDistance = 4; // Distância para ativar (metros)

    // Obter a direção para onde a câmara está a olhar
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);

    artworks.forEach((art, i) => {
      const isLeft = i % 2 === 0;
      const x = isLeft ? -width / 2 + 0.1 : width / 2 - 0.1;
      const z = i * 4 - (artworks.length * 4) / 2;

      const artPos = new THREE.Vector3(x, 0, z);
      const dist = camera.position.distanceTo(artPos);

      if (dist < minDistance) {
        // Calcular vetor da câmara até à obra
        const dirToArt = new THREE.Vector3()
          .subVectors(artPos, camera.position)
          .normalize();

        // Produto escalar (Dot Product): 1.0 = olhar diretamente, 0.0 = 90 graus
        // > 0.9 cria um "cone" de visão apertado (aprox. 25 graus)
        if (cameraDir.dot(dirToArt) > 0.9) {
          minDistance = dist;
          closest = art;
        }
      }
    });

    if (closest) {
      if (lastLookedAt.current !== closest.id) {
        lastLookedAt.current = closest.id;
        timer.current = 0;
      } else {
        timer.current += delta;
        if (timer.current >= 2) {
          setArtwork((prev) => (prev?.id === closest.id ? prev : closest));
        }
      }
    } else {
      lastLookedAt.current = null;
      timer.current = 0;
      setArtwork((prev) => (prev === null ? prev : null));
    }
  });
  return null;
}

// Sala de Museu (Quadrada)
function MuseumCorridor({ artworks, onStartGame }) {
  const width = 10; // Largura do corredor
  const length = 50; // Comprimento do corredor

  return (
    <group>
      {/* Chão com Reflexo (MeshReflectorMaterial) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.01, 0]}>
        <planeGeometry args={[width, length]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={0.5}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#2a2a2a"
          metalness={0.5}
        />
      </mesh>

      {/* Tapete Vermelho Central */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.0, 0]}>
        <planeGeometry args={[3, 48]} />
        <meshStandardMaterial color="#8b0000" roughness={0.9} />
      </mesh>

      {/* Teto */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.01, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Paredes Laterais Longas */}
      <mesh position={[-width / 2, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[length, 12]} />
        <meshStandardMaterial color="#5c2323" />
      </mesh>
      <mesh position={[width / 2, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[length, 12]} />
        <meshStandardMaterial color="#5c2323" />
      </mesh>

      {/* Paredes de Fundo (Fechar o corredor) */}
      <mesh position={[0, 1, -length / 2]}>
        <planeGeometry args={[width, 12]} />
        <meshStandardMaterial color="#3e1b1b" />
      </mesh>
      <mesh position={[0, 1, length / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width, 12]} />
        <meshStandardMaterial color="#3e1b1b" />
      </mesh>

      {/* Decoração: Bancos no centro */}
      <Bench position={[0, -2, -15]} />
      <Bench position={[0, -2, -5]} />
      <Bench position={[0, -2, 5]} />
      <Bench position={[0, -2, 15]} />

      {/* Botão Proibido (Easter Egg) */}
      <ForbiddenButton onClick={onStartGame} />

      {/* Iluminação ao longo do corredor */}
      <Lamp position={[0, 2.5, -15]} />
      <Lamp position={[0, 2.5, -5]} />
      <Lamp position={[0, 2.5, 5]} />
      <Lamp position={[0, 2.5, 15]} />

      {artworks.map((art, i) => {
        // Distribuir obras Esquerda vs Direita ao longo do corredor
        const isLeft = i % 2 === 0;
        const x = isLeft ? -width / 2 + 0.1 : width / 2 - 0.1;
        // Espaçamento Z (centrado no corredor)
        const z = i * 4 - (artworks.length * 4) / 2;
        const rotation = [0, isLeft ? Math.PI / 2 : -Math.PI / 2, 0];

        // Posição da barreira de proteção
        const barrierX = isLeft ? x + 1.5 : x - 1.5;

        // URL da imagem (usando a lógica do Art Institute)
        const imgUrl = art.image_id
          ? `https://www.artic.edu/iiif/2/${art.image_id}/full/400,/0/default.jpg`
          : "https://via.placeholder.com/400x600?text=No+Image";

        return (
          <group key={art.id}>
            {/* Tapete Lateral (Ligação à obra) */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[isLeft ? -2.5 : 2.5, -1.99, z]}
            >
              {/* args: [Largura X, Altura Y(Z)] -> Liga o tapete central (1.5) à barreira (3.5) */}
              <planeGeometry args={[2, 1]} />
              <meshStandardMaterial color="#8b0000" roughness={0.9} />
            </mesh>

            <Frame
              url={imgUrl}
              title={art.title}
              position={[x, 0, z]}
              rotation={rotation}
            />

            {/* Proteções (Barreiras e Corda) */}
            <Barrier position={[barrierX, -2, z - 0.8]} />
            <Barrier position={[barrierX, -2, z + 0.8]} />

            {/* Corda Dourada */}
            <mesh position={[barrierX, -1.4, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 1.6]} />
              <meshStandardMaterial
                color="#DAA520"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function Portfolio3D() {
  const [artistName, setArtistName] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [started, setStarted] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // Estado do cursor
  const [loading, setLoading] = useState(false);
  const [gameMode, setGameMode] = useState(false);
  const [isShooting, setIsShooting] = useState(false); // Estado para animação da arma
  const [playerHealth, setPlayerHealth] = useState(100); // Estado visual da vida
  const [playerShield, setPlayerShield] = useState(0); // Estado visual do escudo
  const [score, setScore] = useState(0); // Estado da pontuação
  const [damageFlash, setDamageFlash] = useState(false); // Estado para o flash de dano

  // Desbloquear o rato quando os detalhes abrem para permitir scroll
  useEffect(() => {
    if (selectedArtwork) {
      document.exitPointerLock();
    }
  }, [selectedArtwork]);

  const handleStart = (e) => {
    e.preventDefault();
    if (!artistName.trim()) return;

    setLoading(true);
    // Pesquisa específica por autor, limitando a 12 obras e pedindo os campos necessários
    fetch(
      `https://api.artic.edu/api/v1/artworks/search?q=${artistName}&limit=12&fields=id,title,image_id,artist_display,date_display,dimensions,medium_display`
    )
      .then((res) => res.json())
      .then((data) => {
        // Filtramos apenas as que têm imagem para ficar bonito no 3D
        const validArtworks = data.data.filter((item) => item.image_id);
        setArtworks(validArtworks);
        setStarted(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        alert("Erro ao buscar obras.");
      });
  };

  // Se ainda não começou, mostra o formulário HTML normal
  if (!started) {
    return (
      <div
        className="container d-flex flex-column align-items-center justify-content-center"
        style={{ height: "80vh" }}
      >
        <div
          className="card shadow-lg p-5 border-0 text-center"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <h1 className="display-4 mb-4">🎨 Portfólio 3D</h1>
          <p className="text-muted mb-4">
            Digita o nome de um artista para entrar numa galeria virtual
            imersiva.
          </p>
          <form onSubmit={handleStart}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control form-control-lg text-center"
                placeholder="Ex: Van Gogh, Monet..."
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-dark btn-lg w-100"
              disabled={loading}
            >
              {loading ? "A carregar..." : "Entrar na Galeria 3D"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Se já temos dados, mostra o Canvas 3D
  return (
    // position: relative corrige o problema do botão sobrepor a navbar
    <div
      style={{
        width: "100vw",
        height: "90vh",
        background: "#1a1a1a",
        position: "relative",
      }}
    >
      {/* Botão para voltar flutuante */}
      <button
        className="btn btn-light position-absolute top-0 start-0 m-3 shadow"
        style={{ zIndex: 1000 }}
        onClick={() => setStarted(false)}
      >
        &larr; Voltar à pesquisa
      </button>

      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }} shadows>
        {/* Controlador de Movimento (WASD) */}
        <Player isLocked={isLocked} selectedArtwork={selectedArtwork} />

        {/* Luz ambiente suave */}
        <ambientLight intensity={0.1} />
        {/* Ambiente noturno/interior */}
        <Environment preset="night" />

        {/* A nossa sala de museu */}
        <MuseumCorridor
          artworks={artworks}
          onStartGame={() => {
            setScore(0);
            setPlayerHealth(100);
            setPlayerShield(0);
            setGameMode(true);
          }}
        />

        {/* Detetor de Proximidade */}
        {!gameMode && (
          <ProximityHandler
            artworks={artworks}
            setArtwork={setSelectedArtwork}
          />
        )}

        {/* Lógica do Jogo Easter Egg */}
        {gameMode && (
          <EasterEggGame
            setShootingAnim={setIsShooting}
            currentScore={score}
            onScoreUpdate={(points) => setScore(s => s + points)}
            onStatsUpdate={(health, shield, isDamage) => {
              setPlayerHealth(health);
              setPlayerShield(shield);
              if (isDamage) {
                setDamageFlash(true);
                setTimeout(() => setDamageFlash(false), 150);
              }
            }}
            onGameOver={() => {
              alert(`GAME OVER! Score Final: ${score}`);
              setStarted(false);
              setGameMode(false);
              setPlayerHealth(100);
              setPlayerShield(0);
              setScore(0);
            }}
          />
        )}

        {/* Arma do Jogador (Visual) */}
        {gameMode && <PlayerGun isShooting={isShooting} />}

        {/* Controlos FPS (Rato para olhar) */}
        <PointerLockControls
          onLock={() => setIsLocked(true)}
          onUnlock={() => setIsLocked(false)}
        />
      </Canvas>

      {/* Instruções de Navegação */}
      {!isLocked && !selectedArtwork && !gameMode && (
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white bg-dark bg-opacity-75 p-4 rounded shadow">
          <h3>🎨 Clique para Explorar</h3>
          <p>
            Use <strong>W A S D</strong> para andar
          </p>
          <p>Mova o rato para olhar</p>
          <p className="small text-muted">ESC para sair</p>
        </div>
      )}

      {/* HUD do Jogo */}
      {gameMode && (
        <div className="position-absolute top-0 start-0 p-4 text-white">
          <h2 className="fw-bold text-danger">MODO SOBREVIVÊNCIA</h2>
          <h3>Vida: {playerHealth}%</h3>{" "}
          {playerShield > 0 && <h3 className="text-info">Escudo: {playerShield}%</h3>}
          <h3>Score: {score}</h3>
          {/* Nota: Para atualizar isto em tempo real precisaria de sync com o ref do jogo, mas para simplicidade fica estático ou requer state lift */}
          <p className="small">Clique para disparar!</p>
        </div>
      )}

      {/* Efeito de Flash de Dano */}
      {damageFlash && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 bg-danger"
          style={{ opacity: 0.3, pointerEvents: "none", zIndex: 2000 }}
        />
      )}

      {/* Mira (Crosshair) para ajudar a clicar */}
      {(isLocked || gameMode) && (
        <div
          className="position-absolute top-50 start-50 translate-middle bg-white rounded-circle opacity-50"
          style={{ width: "10px", height: "10px", pointerEvents: "none" }}
        />
      )}

      {/* Painel de Detalhes (Overlay) */}
      {selectedArtwork && (
        <div
          className="position-absolute top-0 end-0 h-100 bg-white shadow p-4 overflow-auto"
          style={{
            width: "400px",
            maxWidth: "100%",
            zIndex: 2000,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 mb-0">Detalhes da Obra</h2>
          </div>

          <img
            src={`https://www.artic.edu/iiif/2/${selectedArtwork.image_id}/full/400,/0/default.jpg`}
            className="img-fluid rounded mb-4 shadow-sm"
            alt={selectedArtwork.title}
          />

          <h3 className="h5 fw-bold">{selectedArtwork.title}</h3>
          <p className="text-muted mb-3">{selectedArtwork.artist_display}</p>

          <hr />

          <p className="small mb-1">
            <strong>Data:</strong> {selectedArtwork.date_display}
          </p>
          <p className="small mb-1">
            <strong>Dimensões:</strong> {selectedArtwork.dimensions}
          </p>
          <p className="small mb-1">
            <strong>Material:</strong> {selectedArtwork.medium_display}
          </p>
        </div>
      )}
    </div>
  );
}
