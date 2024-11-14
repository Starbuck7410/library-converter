# This is an example PKGBUILD file. Use this as a start to creating your own,
# and remove these comments. For more information, see 'man PKGBUILD'.
# NOTE: Please fill out the license field for your package! If it is unknown,
# then please put 'unknown'.

# Maintainer: Your Name <youremail@domain.com>
pkgname=library-converter-git
pkgver=3.3.0
pkgrel=1
epoch=
pkgdesc="A music library format converter, to make holding archival and compressed copies of music libraries easier."
arch=(x86_64)
url="https://github.com/Starbuck7410/library-converter.git"
license=('GPL')
groups=()
depends=(ffmpeg)
makedepends=(nodejs npm)
checkdepends=()
optdepends=()
provides=(library-converter)
conflicts=()
replaces=()
backup=()
options=()
install=
changelog=
source=("git+$url")
noextract=()
md5sums=() #generate with 'makepkg -g'

prepare() {
    npm install
	npm install -g @yao-pkg/pkg
}

build() {
	pkg main.js --target node22-linux-x64
}

check() {
}

package() {
	cp main /usr/bin/library-converter
}

# cd "$srcdir/$pkgname-$pkgver"
# make DESTDIR="$pkgdir/" install