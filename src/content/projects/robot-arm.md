---
title: 4-DOF Robot Arm with MoveIt 2
summary: A robot arm designed for 3D printing around DYNAMIXEL servos, and simulated end to end in ROS 2, from the CAD to a pick and place.
order: 1
tags: [ROS 2, MoveIt 2, Gazebo, CadQuery, Python]
note: Simulated only · not built yet
cover: /media/robot-arm/arm_cad.png
coverAlt: CAD assembly of the arm, with a printed tripod base, blue link plates around the servos and a rack-and-pinion gripper
video: /media/robot-arm/pick_and_place.mp4
videoCaption: Pick and place in Gazebo. The arm picks a 20 mm cube, checks the grasp and places it on the other side (34 s).
images:
  - src: /media/robot-arm/arm_cad.png
    alt: CAD assembly of the arm, with a printed tripod base, an L-shaped tower, blue link plates around the servos and a rack-and-pinion gripper
    caption: The full assembly, designed in Python with CadQuery.
  - src: /media/robot-arm/gripper_cad.png
    alt: Gripper detail, where the servo drives a pinion between two racks, each carrying one jaw
    caption: The gripper. One servo turns a pinion (m2, 18 teeth) that moves two racks, one per jaw.
facts:
  - label: reach
    value: 278.5 mm
  - label: total mass
    value: 740 g
  - label: printed parts (PLA)
    value: "19"
  - label: DYNAMIXEL servos
    value: "5"
repo: https://github.com/Danion1/robot-arm-moveit2
---

## What it is

A 4-joint robot arm with a parallel gripper. One parametric model, written in Python, gives both the printable parts and everything the simulation needs: meshes, masses and inertias. The arm then runs in Gazebo with ros2_control and plans its moves with MoveIt 2, all the way to picking up a cube and placing it somewhere else.

## Key decisions

- **A serial arm, not a parallelogram.** The closed loop of a parallelogram is hard to describe in URDF and complicates MoveIt 2. I accepted more torque at the shoulder in exchange for simpler software.
- **Servos chosen by calculation.** The servo for each joint comes from the torque the CAD masses demand, not from a guess.
- **Position control, like the real servos.** Position is the servos' default mode, and the gripper servo has no torque mode at all. Simulating something the hardware cannot do would not transfer to the real arm.
- **A grasp that is checked.** Physics closes the gripper, the node checks that it stopped on the object, and only then does a fixed joint hold the cube. If the gripper closes on nothing, the pick is aborted.

## How it was validated

Every number below comes from a script that runs without a GUI and compares the simulation against an independent reference.

- **Kinematics:** the hand-written formulas match the CAD solids within 1.1e-13 mm over 30 poses.
- **Physics:** joint torques in Gazebo match the hand calculation from the CAD masses within 0.15 %.
- **Collisions:** over 600 random poses, MoveIt 2 never called a pose free when the CAD solids actually collide.
- **Grasp:** on a 20 mm cube, each finger stops at 10.7 to 11.0 mm (contact is expected at 11.0 mm).

## Limitations

- Simulated only. Nothing has been printed or tested on hardware yet.
- The cube's position is given to the robot in advance. There is no camera or perception yet.
- While carrying, the cube is held by a fixed joint, so slipping in the gripper is not simulated.
- Placement repeatability in simulation is 0.2 to 4.2 mm (3 runs).
