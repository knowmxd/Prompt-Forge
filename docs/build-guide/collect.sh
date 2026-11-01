#!/bin/sh
# Copies the screenshots and pose/camera sheets used by the build guide into ./img
set -eu
cd "$(dirname "$0")"
mkdir -p img
B=/Users/master/.gemini/antigravity/brain/ad783fe0-63a5-488b-a255-77e044f6931c
R=../../screenshots
cp "$B/knight_poses_grid_1793429667137.jpg" img/grid_knights.jpg
cp "$B/fine_art_poses_grid_1793433045868.jpg" img/grid_art.jpg
cp "$B/editorial_photoshoot_grid_1793433067660.jpg" img/grid_editorial.jpg
cp "$B/duo_poses_grid_1793435408616.jpg" img/grid_duo.jpg
cp "$B/camera_angles_elevations_grid_1793437813731.jpg" img/grid_cam_elev.jpg
cp "$B/camera_angles_framing_grid_1793437844166.jpg" img/grid_cam_frame.jpg
cp "$B/camera_lenses_optics_grid_1793437869315.jpg" img/grid_cam_lens.jpg
cp "$B/modal-all-expanded.png" img/shot_pose_gallery.png
cp "$B/modal-camera-all.png" img/shot_camera_gallery.png
cp "$B/workbench-framing-applied.png" img/shot_camera_applied.png
cp "$B/workbench-posture-ballroom.png" img/shot_posture_applied.png
cp "$B/shelf-camera-plant-cards.png" img/shot_shelf.png
cp "$R/characters.png" img/shot_workbench.png
cp "$R/bookmark-sheet.png" img/shot_bookmark.png
ls -la img
