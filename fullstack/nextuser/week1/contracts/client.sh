 
export PKG=0xbbb82090bf6c88a8a43dd07fd0826200875624926ad3e0a27b038c6262b03dcb
export STATE=0x305d297d2d05efc906efe9bdd8027592661e71107c405dea83d9658754d938ad
sui client ptb --move-call $PKG::week_one_alt::create_profile "'name1' 'desc1' @$STATE"
