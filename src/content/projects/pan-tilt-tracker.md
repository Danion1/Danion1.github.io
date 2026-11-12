---
title: Pan-Tilt Vision Tracker
summary: A two-axis turret designed for 3D printing that finds a drone in its camera image, keeps it centered and fires a foam dart at it, simulated end to end in ROS 2 and Gazebo.
order: 2
tags: [ROS 2, Gazebo, OpenCV, CadQuery, Python]
note: Simulated only · not built yet
cover: /media/pan-tilt-tracker/turret_cad.png
cardMedia: cover
coverAlt: CAD assembly of the turret, with a square electronics box, a geared turntable, two green arms holding the tilting launcher and a webcam on top
video: /media/pan-tilt-tracker/tracking_shot.mp4
poster: /media/pan-tilt-tracker/tracking_shot_poster.jpg
videoCaption: In Gazebo, the turret follows a drone with its simulated webcam and fires a foam dart that hits the drone's body (real time, 8 s).
images:
  - src: /media/pan-tilt-tracker/turret_cad.png
    alt: CAD assembly of the turret, with the electronics box, the 40-tooth pan ring gear, the arms, the launcher with two flywheels and the webcam
    caption: The full assembly, designed in Python with CadQuery.
  - src: /media/pan-tilt-tracker/turret_cad_tilt.png
    alt: Side view of the turret with the launcher tilted 40 degrees up
    caption: Tilted 40° up. The webcam rides on the launcher, so it always looks where the dart goes.
  - src: /media/pan-tilt-tracker/shot_slow_motion.gif
    alt: Slow-motion shot in Gazebo, with a zoomed inset where the blue dart strikes the drone and drops
    caption: The same shot in 8× slow motion, with a 3× zoom on the drone.
facts:
  - label: detection rate
    value: 99.6 %
  - label: mean tracking error
    value: 0.9°
  - label: dart exit speed
    value: 21.6 m/s
  - label: hover hits at 2, 3, 4 m
    value: 3–9 mm
repo: https://github.com/Danion1/TODO-turret-repo
---

## What it is

A pan-tilt turret that watches a drone through a webcam, keeps it in the middle of the image and launches a commercial foam dart at it. The pan axis turns on a bearing through a 2:1 gear pair, the tilt axis carries both the launcher and the webcam, and two flywheels spinning in opposite directions throw the dart. One parametric CAD model, written in Python, gives the printable parts and the robot description for the simulation. In Gazebo, ROS 2 nodes detect the drone, steer the turret and fire.

## Key decisions

- **A commercial dart, not a printed one.** A printed dart would need a fit tighter than the printer can hold, and would be less safe. The launcher is printed; the dart is a standard foam dart.
- **The turret's weight sits on a bearing.** The pan servo drives a 20-tooth pinion against a 40-tooth ring gear on a 6808 bearing, so the servo only turns the turret and does not carry it.
- **Every mechanism moves in the simulation.** The gears, the flywheels and the rack that pushes the dart are real joints in Gazebo, and their ratios were measured there, not just assumed.
- **Aim correction from a calculation.** The dart leaves below the camera and drops on its way. The first test shot passed 137 mm under a hovering drone at 3 m, as the calculation predicted, and the correction now hits it.

## How it was validated

- **Detection:** the detector finds the drone in 99.6 % of the frames, 1.7 px from its true position on average.
- **Tracking:** with the drone flying back and forth, the aim stays 0.9° off on average (1.7° at most), and the drone never leaves the image.
- **Launcher:** the dart leaves at 21.6 m/s along the barrel; the full firing sequence takes about 1.35 s.
- **Shots:** against a hovering drone at 2, 3 and 4 m, the dart hits within 3 to 9 mm of the aim point.

## Limitations

- Simulated only. Nothing has been printed or built yet, and the webcam is simulated.
- The detector looks for the drone's color, so it needs a clean background.
- There is no motion prediction yet: the turret fires where the drone is now, not where it will be. A Kalman filter is the next step.
