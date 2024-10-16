<?php
$directory = 'Testimonios/';
$images = glob($directory . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);
$imageNames = array_map('basename', $images);
header('Content-Type: application/json');
echo json_encode($imageNames);