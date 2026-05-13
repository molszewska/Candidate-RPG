import { useEffect, useRef, useState, useCallback } from 'react';
import { VIEWPORT_W, VIEWPORT_H, DISPLAY_SCALE } from '../constants/config';
import { useGameLoop } from './useGameLoop';
import { AssetLoader } from './AssetLoader';
import { InputManager } from './InputManager';
import { Camera } from './Camera';
import { CollisionSystem } from './CollisionSystem';
import { Renderer } from './Renderer';
import { SceneManager } from './SceneManager';
import { PlayerEntity } from '../entities/PlayerEntity';
import { LoadingScreen } from '../ui/LoadingScreen';
import { useGameStore } from '../state/gameStore.client';
import { useInputStore } from '../state/inputStore.client';

// Module-level singletons — created once, never recreated
const inputManager  = new InputManager();
const assetLoader   = new AssetLoader();
const camera        = new Camera();
const collision     = new CollisionSystem();
const renderer      = new Renderer();
const sceneManager  = new SceneManager();
const playerEntity  = new PlayerEntity();

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef    = useRef<CanvasRenderingContext2D | null>(null);

  const [progress, setProgress] = useState(0);
  const [loaded,   setLoaded]   = useState(false);
  const [showGame, setShowGame] = useState(false);

  const loop = useGameLoop();

  // ── Canvas DPI setup ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = VIEWPORT_W * dpr;
    canvas.height = VIEWPORT_H * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;
    ctxRef.current = ctx;
    renderer.init(ctx);
  }, []);

  // ── Asset loading + input init ────────────────────────────────────────────
  useEffect(() => {
    assetLoader.load((pct) => setProgress(pct)).then(() => setLoaded(true));
    inputManager.init();
    return () => inputManager.destroy();
  }, []);

  // ── Scene + collision init (runs when assets are ready) ───────────────────
  useEffect(() => {
    if (!loaded) return;

    const scene = sceneManager.getCurrentScene();
    collision.init(scene.collision.data, scene.width, scene.height);

    // Snap camera to spawn position without lerp
    const store = useGameStore.getState();
    useGameStore.setState({
      playerX: scene.spawnX,
      playerY: scene.spawnY,
    });
    camera.snapTo(scene.spawnX, scene.spawnY, scene.width, scene.height);
    useGameStore.setState({ cameraX: camera.x, cameraY: camera.y });
  }, [loaded]);

  // ── Game loop systems ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!showGame) return;

    // ── Update ──────────────────────────────────────────────────────────────
    const update = (_dt: number) => {
      const {
        playerX, playerY,
        setPlayerPos, setPlayerFacing, setIsMoving, setCameraPos, tickAnim,
        isTransitioning,
      } = useGameStore.getState();

      if (isTransitioning) return;

      const { heldKeys } = useInputStore.getState();
      const scene = sceneManager.getCurrentScene();

      // Player movement
      const result = playerEntity.update(playerX, playerY, heldKeys, collision);
      setPlayerPos(result.x, result.y);
      setPlayerFacing(result.facing);
      setIsMoving(result.isMoving);

      // Camera follow
      camera.update(result.x, result.y, scene.width, scene.height);
      setCameraPos(camera.x, camera.y);

      // Animation tick
      tickAnim();
    };

    // ── Render ──────────────────────────────────────────────────────────────
    const render = (_alpha: number) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      const {
        playerX, playerY, playerFacing, isMoving,
        cameraX, cameraY, animTick,
        isTransitioning, transitionAlpha,
      } = useGameStore.getState();

      const scene = sceneManager.getCurrentScene();

      renderer.clear(ctx);

      // Ground layer
      renderer.drawLayer(ctx, scene.ground, scene.width, scene.height, cameraX, cameraY, animTick);

      // Objects layer
      renderer.drawLayer(ctx, scene.objects, scene.width, scene.height, cameraX, cameraY, animTick);

      // Building labels
      for (const label of scene.labels) {
        const { sx, sy } = camera.tileToScreen(label.col, label.row);
        if (sx > -100 && sx < VIEWPORT_W + 100 && sy > -20 && sy < VIEWPORT_H) {
          renderer.drawLabel(ctx, label.text, sx + 16, sy);
        }
      }

      // Player
      renderer.drawPlayer(
        ctx,
        playerX, playerY,
        playerFacing,
        isMoving,
        cameraX, cameraY,
        animTick,
      );

      // Transition overlay
      if (isTransitioning) renderer.drawTransitionOverlay(ctx, transitionAlpha);
    };

    loop.registerUpdate(update);
    loop.registerRender(render);
    return () => {
      loop.unregisterUpdate(update);
      loop.unregisterRender(render);
    };
  }, [showGame, loop]);

  const handleLoadDone = useCallback(() => setShowGame(true), []);

  // CSS scale to fill the window while preserving 640×480 ratio
  const [scale, setScale] = useState(1);
  useEffect(() => {
    function computeScale() {
      setScale(Math.min(
        window.innerWidth  / VIEWPORT_W,
        window.innerHeight / VIEWPORT_H,
      ));
    }
    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, []);

  return (
    <div className="game-viewport">
      {!showGame && (
        <LoadingScreen
          progress={loaded ? 1 : progress}
          onDone={handleLoadDone}
        />
      )}
      <canvas
        ref={canvasRef}
        className="pixel-canvas"
        style={{
          width:   VIEWPORT_W * scale,
          height:  VIEWPORT_H * scale,
          display: showGame ? 'block' : 'none',
        }}
      />
    </div>
  );
}
