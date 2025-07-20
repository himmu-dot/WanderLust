const Listing = require("../models/listing.js")
//const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
//const mapToken = process.env.MAP_TOKEN;
//const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const fetch = require('node-fetch');

require("dotenv").config();

async function getCoordinates(location) {
    const token = process.env.NEWMAP_TOKEN;
    const url = `https://us1.locationiq.com/v1/search.php?key=${token}&q=${encodeURIComponent(location)}&format=json`;

    const res = await fetch(url);
    
    if (!res.ok) {
        console.error(`LocationIQ error: ${res.status} ${res.statusText}`);
        return null;
    }

    const data = await res.json();

    if (data.length > 0) {
        return {
            type: 'Point',
            coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
        };
    } else {
        return null;
    }
}



module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate( {path:"reviews",populate: {path: "author"},}).populate("owner");
    if(!listing){
        req.flash("error", "Listing Does Not Exists!!");
         return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing}); 
}

module.exports.createListing = async (req, res, next) => {
    //console.log("Received location:", req.body.listing.location);
    //let {title,description,image,price,location,country} = req.body;
    // let listing = req.body.listing;

    // let response = await geocodingClient
    //     .forwardGeocode({
    //         query: req.body.listing.location,
    //         limit: 1
    //     })
    //     .send()
        
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    //newListing.geometry = response.body.features[0].geometry;
    const geoData = await getCoordinates(req.body.listing.location);
newListing.geometry = geoData;


    let savedListing = await newListing.save();
    //console.log(savedListing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
    // console.log(listing);
}

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing Does Not Exists!!");
         return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")    
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const updatedData = req.body.listing;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // 🧠 If location has changed, update coordinates
    if (updatedData.location && updatedData.location !== listing.location) {
        const geoData = await getCoordinates(updatedData.location);
        if (geoData) {
            updatedData.geometry = geoData;
        } else {
            req.flash("error", "Could not find coordinates for the new location.");
            return res.redirect(`/listings/${id}/edit`);
        }
    }

    // 📝 Update the listing fields
    Object.assign(listing, updatedData);

    // 🖼️ Update image if new one is uploaded
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    // console.log("Listing DELETED");
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}