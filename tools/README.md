# tools

## render-demos.py

Escenas de Blender para las imágenes de las plantillas de demostración.
No son dibujos de CSS: son renders con Cycles que se generan así, una por
escena (`restaurante`, `masajes`, `dental`, `influencer`):

```
blender --background --python tools/render-demos.py -- restaurante salida.png gpu
```

Luego se pasan a WebP y se dejan en `public/demos/<escena>.webp`:

```
node -e "require('sharp')('salida.png').resize(1200,900,{fit:'cover'}).webp({quality:84}).toFile('public/demos/restaurante.webp')"
```

Cada escena tarda unos segundos con GPU. El último argumento puede ser `cpu`
si la tarjeta está ocupada (por ejemplo, jugando).
