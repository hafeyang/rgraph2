<?php
$svgContent = "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\" ?>\n".$_POST["svg"];
if(file_exists("input.svg")){
    unlink("input.svg");
}
if(file_exists("exported.png")){
    unlink("exported.png");
}
file_put_contents('input.svg', $svgContent);
exec("java -jar batik-rasterizer.jar  input.svg  -m image/png -d exported.png");
header("Location:exported.png");
