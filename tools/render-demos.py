"""Renders para las plantillas de demostración.

Se ejecuta con:
    blender --background --python render_demos.py -- <escena> <salida.png> [gpu|cpu]

Cada escena es pequeña a propósito: un motivo central, fondo de color y dos o
tres luces. Lo que se busca es una imagen limpia que sustituya a los dibujos
de CSS, no una producción.
"""
import bpy
import math
import sys
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
ESCENA = argv[0]
SALIDA = argv[1]
DISPOSITIVO = argv[2] if len(argv) > 2 else 'cpu'


def limpiar():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def material(nombre, color, rugosidad=0.5, metalico=0.0, emision=None, fuerza=1.0):
    mat = bpy.data.materials.new(nombre)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Roughness'].default_value = rugosidad
    bsdf.inputs['Metallic'].default_value = metalico
    if emision is not None:
        bsdf.inputs['Emission Color'].default_value = (*emision, 1)
        bsdf.inputs['Emission Strength'].default_value = fuerza
    return mat


def bump(mat, escala=18.0, fuerza=0.25, detalle=6.0, rugosidad=None, estirar=None):
    """Ruido a normales y, si se pide, a la rugosidad. Sin variación de brillo
    cualquier superficie parece plastilina por muy bien iluminada que esté."""
    nt = mat.node_tree
    bsdf = nt.nodes['Principled BSDF']
    ruido = nt.nodes.new('ShaderNodeTexNoise')
    ruido.inputs['Scale'].default_value = escala
    ruido.inputs['Detail'].default_value = detalle

    if estirar:
        coord = nt.nodes.new('ShaderNodeTexCoord')
        mapeo = nt.nodes.new('ShaderNodeMapping')
        mapeo.inputs['Scale'].default_value = estirar
        nt.links.new(coord.outputs['Object'], mapeo.inputs['Vector'])
        nt.links.new(mapeo.outputs['Vector'], ruido.inputs['Vector'])

    nodo = nt.nodes.new('ShaderNodeBump')
    nodo.inputs['Strength'].default_value = fuerza
    nt.links.new(ruido.outputs['Fac'], nodo.inputs['Height'])
    nt.links.new(nodo.outputs['Normal'], bsdf.inputs['Normal'])

    if rugosidad:
        mapa = nt.nodes.new('ShaderNodeMapRange')
        mapa.inputs['To Min'].default_value = rugosidad[0]
        mapa.inputs['To Max'].default_value = rugosidad[1]
        nt.links.new(ruido.outputs['Fac'], mapa.inputs['Value'])
        nt.links.new(mapa.outputs['Result'], bsdf.inputs['Roughness'])
    return mat


def poner(obj, mat, suave=True):
    obj.data.materials.append(mat)
    if suave:
        for p in obj.data.polygons:
            p.use_smooth = True
    return obj


def luz(nombre, tipo, energia, loc, tamano=2.0, color=(1, 1, 1), rot=(0, 0, 0)):
    data = bpy.data.lights.new(nombre, type=tipo)
    data.energy = energia
    data.color = color
    if tipo == 'AREA':
        data.size = tamano
    obj = bpy.data.objects.new(nombre, data)
    obj.location = loc
    obj.rotation_euler = rot
    bpy.context.collection.objects.link(obj)
    return obj


def camara(loc, mira=(0, 0, 0), lente=50, dof=None):
    data = bpy.data.cameras.new('Camara')
    data.lens = lente
    cam = bpy.data.objects.new('Camara', data)
    cam.location = loc
    bpy.context.collection.objects.link(cam)
    direccion = Vector(mira) - Vector(loc)
    cam.rotation_euler = direccion.to_track_quat('-Z', 'Y').to_euler()
    bpy.context.scene.camera = cam
    if dof:
        data.dof.use_dof = True
        data.dof.focus_distance = dof
        data.dof.aperture_fstop = 2.8
    return cam


def mundo(color, fuerza=1.0):
    world = bpy.data.worlds.new('Mundo')
    world.use_nodes = True
    fondo = world.node_tree.nodes['Background']
    fondo.inputs['Color'].default_value = (*color, 1)
    fondo.inputs['Strength'].default_value = fuerza
    bpy.context.scene.world = world


def ajustes(ancho, alto, muestras=96):
    esc = bpy.context.scene
    esc.render.engine = 'CYCLES'
    esc.cycles.samples = muestras
    esc.cycles.use_denoising = True
    esc.render.resolution_x = ancho
    esc.render.resolution_y = alto
    esc.render.film_transparent = False
    esc.view_settings.view_transform = 'AgX'
    esc.view_settings.look = 'AgX - Punchy'

    if DISPOSITIVO == 'gpu':
        prefs = bpy.context.preferences.addons['cycles'].preferences
        for tipo in ('OPTIX', 'CUDA'):
            try:
                prefs.compute_device_type = tipo
                prefs.get_devices()
                if any(d.type == tipo for d in prefs.devices):
                    for d in prefs.devices:
                        d.use = d.type in (tipo, 'CPU')
                    esc.cycles.device = 'GPU'
                    break
            except Exception:
                continue


# ---------------------------------------------------------------- restaurante
def escena_restaurante():
    ajustes(1500, 1125, 140)
    mundo((0.04, 0.028, 0.02), 1.0)

    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, 0))
    mesa = material('mesa', (0.055, 0.026, 0.013), 0.55)
    bump(mesa, escala=14, fuerza=0.5, detalle=10, rugosidad=(0.35, 0.7), estirar=(1.0, 26.0, 1.0))
    poner(bpy.context.object, mesa, suave=False)

    # Plato hondo: cilindro con borde de rosca
    bpy.ops.mesh.primitive_cylinder_add(radius=1.75, depth=0.07, vertices=128, location=(0, 0, 0.035))
    plato = poner(bpy.context.object, material('plato', (0.9, 0.885, 0.85), 0.14))
    bpy.ops.object.modifier_add(type='BEVEL')
    plato.modifiers['Bevel'].width = 0.022
    bpy.ops.mesh.primitive_torus_add(major_radius=1.73, minor_radius=0.075, location=(0, 0, 0.07),
                                     major_segments=128, minor_segments=28)
    poner(bpy.context.object, material('borde', (0.91, 0.895, 0.86), 0.13))

    # Espejo de salsa
    bpy.ops.mesh.primitive_cylinder_add(radius=1.2, depth=0.014, vertices=96, location=(0, 0, 0.078))
    salsa = material('salsa', (0.085, 0.026, 0.009), 0.06)
    poner(bpy.context.object, salsa)

    # Pieza principal, con marca de brasa
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=4, radius=0.58, location=(-0.2, 0.12, 0.34))
    carne = bpy.context.object
    carne.scale = (1.3, 0.92, 0.4)
    carne.rotation_euler = (0, 0, math.radians(-12))
    mat_carne = material('carne', (0.075, 0.018, 0.009), 0.3)
    bump(mat_carne, escala=45, fuerza=1.1, detalle=14, rugosidad=(0.18, 0.62))
    poner(carne, mat_carne)

    # Guarnición asada
    for i, (x, y, r) in enumerate([(0.92, -0.42, 0.29), (1.08, 0.2, 0.25), (0.55, 0.66, 0.23),
                                   (0.35, -0.75, 0.2)]):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=r,
                                             location=(x, y, 0.085 + r * 0.72))
        pieza = bpy.context.object
        pieza.scale = (1.05, 0.95, 0.78)
        pieza.rotation_euler = (0, 0, i * 0.9)
        mat = material(f'patata{i}', (0.35, 0.16, 0.03), 0.3)
        bump(mat, escala=55, fuerza=0.9, detalle=12, rugosidad=(0.16, 0.55))
        poner(pieza, mat)

    # Hierbas
    for i, (x, y) in enumerate([(-0.95, -0.55), (-1.1, 0.3), (-0.55, -0.92), (0.05, -0.95), (-0.35, 0.85)]):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.15, location=(x, y, 0.15))
        h = bpy.context.object
        h.scale = (1.6, 1.0, 0.3)
        h.rotation_euler = (0, 0, i * 0.7)
        verde = material(f'verde{i}', (0.035, 0.11, 0.015), 0.32)
        bump(verde, escala=90, fuerza=0.6, detalle=8)
        poner(h, verde)

    # Copa de vino al fondo, para que se lea "mesa puesta"
    bpy.ops.mesh.primitive_cylinder_add(radius=0.34, depth=0.62, vertices=64, location=(2.55, 1.5, 0.62))
    copa = bpy.context.object
    mat_copa = bpy.data.materials.new('cristal')
    mat_copa.use_nodes = True
    nt = mat_copa.node_tree
    bsdf = nt.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (0.55, 0.12, 0.14, 1)
    bsdf.inputs['Roughness'].default_value = 0.04
    bsdf.inputs['Transmission Weight'].default_value = 1.0
    poner(copa, mat_copa)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.05, depth=0.55, vertices=32, location=(2.55, 1.5, 0.28))
    poner(bpy.context.object, mat_copa)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.3, depth=0.03, vertices=48, location=(2.55, 1.5, 0.015))
    poner(bpy.context.object, mat_copa)

    # Servilleta doblada
    bpy.ops.mesh.primitive_cube_add(size=1, location=(-2.6, 0.9, 0.05))
    serv = bpy.context.object
    serv.scale = (0.95, 0.65, 0.06)
    serv.rotation_euler = (0, 0, math.radians(14))
    serv.location = (-3.0, 1.35, 0.06)
    tela = material('servilleta', (0.18, 0.05, 0.03), 0.95)
    bump(tela, escala=120, fuerza=0.8, detalle=6)
    poner(serv, tela, suave=False)

    luz('clave', 'AREA', 1800, (2.6, -2.2, 4.4), tamano=1.6, color=(1.0, 0.9, 0.74),
        rot=(math.radians(32), 0, math.radians(44)))
    luz('relleno', 'AREA', 220, (-3.8, -1.6, 2.2), tamano=6.0, color=(1.0, 0.86, 0.72),
        rot=(math.radians(62), 0, math.radians(-52)))
    luz('contra', 'AREA', 700, (-1.0, 3.8, 3.0), tamano=3.0, color=(1.0, 0.78, 0.55),
        rot=(math.radians(118), 0, math.radians(-16)))

    camara((0.15, -5.5, 4.0), mira=(0, 0.05, 0.3), lente=55, dof=6.7)


# -------------------------------------------------------------------- masajes
def escena_masajes():
    ajustes(1400, 1050, 110)
    mundo((0.16, 0.22, 0.17), 1.0)

    bpy.ops.mesh.primitive_plane_add(size=16, location=(0, 0, 0))
    poner(bpy.context.object, material('suelo', (0.55, 0.60, 0.52), 0.65), suave=False)

    # Torre de piedras
    alturas = [(0.95, 0.30, 0.0), (0.72, 0.24, 0.55), (0.52, 0.19, 1.0), (0.34, 0.14, 1.35)]
    for i, (r, alto, z) in enumerate(alturas):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=r, location=(0, 0, z + alto))
        piedra = bpy.context.object
        piedra.scale = (1.0, 0.82, alto / r)
        piedra.rotation_euler = (0, 0, i * 0.5)
        mat_piedra = material(f'piedra{i}', (0.045, 0.05, 0.045), 0.38)
        bump(mat_piedra, escala=60, fuerza=0.35, detalle=10, rugosidad=(0.25, 0.55))
        poner(piedra, mat_piedra)

    # Toalla enrollada
    bpy.ops.mesh.primitive_cylinder_add(radius=0.42, depth=1.5, vertices=64, location=(2.15, 1.0, 0.42),
                                        rotation=(0, math.radians(90), math.radians(12)))
    poner(bpy.context.object, material('toalla', (0.86, 0.87, 0.82), 0.85))

    # Vela
    bpy.ops.mesh.primitive_cylinder_add(radius=0.3, depth=0.5, vertices=48, location=(-2.15, 0.9, 0.25))
    poner(bpy.context.object, material('vela', (0.9, 0.88, 0.8), 0.6))
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=0.09, location=(-2.15, 0.9, 0.58))
    llama = bpy.context.object
    llama.scale = (0.7, 0.7, 1.6)
    poner(llama, material('llama', (1, 0.7, 0.3), 0.4, emision=(1.0, 0.62, 0.22), fuerza=28))

    luz('clave', 'AREA', 500, (2.6, -3.0, 3.6), tamano=5.0, color=(1.0, 0.97, 0.9),
        rot=(math.radians(45), 0, math.radians(38)))
    luz('relleno', 'AREA', 160, (-3.2, -1.8, 2.0), tamano=6.0, color=(0.8, 0.95, 0.85),
        rot=(math.radians(65), 0, math.radians(-45)))

    camara((0.5, -7.4, 2.8), mira=(0.1, 0, 0.9), lente=50, dof=7.6)


# --------------------------------------------------------------------- dental
def escena_dental():
    ajustes(1400, 1050, 110)
    mundo((0.62, 0.78, 0.92), 1.0)

    bpy.ops.mesh.primitive_plane_add(size=18, location=(0, 0, -1.2))
    poner(bpy.context.object, material('suelo', (0.86, 0.92, 0.97), 0.35), suave=False)

    # Muela: corona redondeada y tres raíces
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=1.05, location=(0, 0, 0.55))
    corona = bpy.context.object
    corona.scale = (1.0, 0.92, 0.72)
    esmalte = material('esmalte', (0.95, 0.96, 0.97), 0.12)
    poner(corona, esmalte)

    for i, (x, y) in enumerate([(-0.5, 0.18), (0.5, 0.18), (0.0, -0.45)]):
        bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=0.34, radius2=0.1, depth=1.5,
                                        location=(x, y, -0.45))
        raiz = bpy.context.object
        raiz.rotation_euler = (math.radians(180 + (12 if y < 0 else -8)), 0, 0)
        poner(raiz, material(f'raiz{i}', (0.93, 0.92, 0.9), 0.3))

    # Anillo de acento
    bpy.ops.mesh.primitive_torus_add(major_radius=2.1, minor_radius=0.055, location=(0, 0, -0.95),
                                     major_segments=96, minor_segments=20)
    poner(bpy.context.object, material('anillo', (0.12, 0.45, 0.78), 0.25, metalico=0.6))

    luz('clave', 'AREA', 700, (2.8, -3.0, 3.4), tamano=5.0, color=(1, 1, 1),
        rot=(math.radians(44), 0, math.radians(40)))
    luz('relleno', 'AREA', 260, (-3.2, -2.0, 1.6), tamano=6.0, color=(0.85, 0.93, 1.0),
        rot=(math.radians(70), 0, math.radians(-45)))
    luz('contra', 'AREA', 380, (0, 3.6, 2.2), tamano=4.0, color=(0.7, 0.85, 1.0),
        rot=(math.radians(115), 0, 0))

    # Fondo para que el blanco del diente no se pierda sobre blanco
    bpy.ops.mesh.primitive_plane_add(size=22, location=(0, 7.0, 4.0), rotation=(math.radians(90), 0, 0))
    poner(bpy.context.object, material('fondo', (0.35, 0.58, 0.8), 0.6), suave=False)

    camara((0, -8.0, 1.9), mira=(0, 0, -0.15), lente=50, dof=8.1)


# ----------------------------------------------------------------- influencer
def escena_influencer():
    """Portada de la página de creador: no hace falta que se reconozca un
    objeto, hace falta que tenga luz. Esferas emisivas sobre suelo pulido y
    niebla fina para que el brillo se vea de verdad, no pintado."""
    ajustes(1600, 900, 150)

    world = bpy.data.worlds.new('Mundo')
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes['Background'].inputs['Color'].default_value = (0.01, 0.008, 0.025, 1)
    nt.nodes['Background'].inputs['Strength'].default_value = 1.0
    # Niebla: la que convierte una esfera encendida en un halo
    volumen = nt.nodes.new('ShaderNodeVolumeScatter')
    volumen.inputs['Density'].default_value = 0.016
    volumen.inputs['Color'].default_value = (0.55, 0.45, 1.0, 1)
    nt.links.new(volumen.outputs['Volume'], nt.nodes['World Output'].inputs['Volume'])
    bpy.context.scene.world = world

    # Suelo pulido: dobla las luces por reflejo
    bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, -2.2))
    suelo = material('suelo', (0.015, 0.012, 0.03), 0.08, metalico=0.4)
    poner(bpy.context.object, suelo, suave=False)

    orbes = [
        (-4.2, 3.0, 0.7, 0.95, (1.0, 0.16, 0.48), 4.5),
        (3.6, 1.2, -0.4, 0.7, (0.45, 0.25, 1.0), 4.0),
        (0.4, 8.5, 2.2, 1.3, (0.9, 0.25, 0.7), 1.8),
        (7.2, 4.5, -1.0, 0.5, (0.2, 0.7, 1.0), 3.5),
        (-7.4, 5.5, -1.2, 0.42, (1.0, 0.45, 0.8), 3.2),
        (1.6, 4.0, 2.6, 0.3, (0.6, 0.9, 1.0), 3.0),
    ]
    for i, (x, y, z, r, c, fuerza) in enumerate(orbes):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=r, location=(x, y, z))
        poner(bpy.context.object, material(f'orbe{i}', c, 0.2, emision=c, fuerza=fuerza))

    # Aro de neón atravesando la escena
    bpy.ops.mesh.primitive_torus_add(major_radius=4.6, minor_radius=0.05, location=(0.4, 3.4, 0.2),
                                     rotation=(math.radians(74), math.radians(12), 0),
                                     major_segments=128, minor_segments=16)
    poner(bpy.context.object, material('aro', (0.7, 0.4, 1.0), 0.15, emision=(0.75, 0.45, 1.0), fuerza=6))

    # Barras de luz al fondo
    for i, (x, z, c) in enumerate([(-7.5, 1.2, (1.0, 0.2, 0.5)), (7.8, 0.6, (0.35, 0.35, 1.0))]):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 8.0, z))
        barra = bpy.context.object
        barra.scale = (0.12, 0.12, 6.0)
        barra.rotation_euler = (0, math.radians(14 if i == 0 else -14), 0)
        poner(barra, material(f'barra{i}', c, 0.2, emision=c, fuerza=4.5), suave=False)

    luz('relleno', 'AREA', 60, (0, -6.0, 3.0), tamano=8.0, color=(0.6, 0.55, 1.0),
        rot=(math.radians(55), 0, 0))

    camara((0.3, -15.5, 1.6), mira=(0, 2.0, 0.3), lente=42, dof=16.0)


ESCENAS = {
    'restaurante': escena_restaurante,
    'masajes': escena_masajes,
    'dental': escena_dental,
    'influencer': escena_influencer,
}

limpiar()
ESCENAS[ESCENA]()
bpy.context.scene.render.filepath = SALIDA
bpy.context.scene.render.image_settings.file_format = 'PNG'
bpy.ops.render.render(write_still=True)
print('LISTO', ESCENA, SALIDA)
