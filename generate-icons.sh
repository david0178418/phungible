sizes=(
	"512x512"
	"384x384"
	"192x192"
	"152x152"
	"144x144"
	"128x128"
	"96x96"
	"72x72"
	"48x48"
	"36x36"
	"32x32"
	"16x16"
)

cd ./src/client/static/images/icons/

for size in "${sizes[@]}"; do
	convert phungible-pig.png -resize $size icon-$size.png
done

convert icon-16x16.png icon-36x36.png icon-48x48.png favicon.ico
