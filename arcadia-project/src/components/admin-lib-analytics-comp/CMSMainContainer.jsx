import React, { useState, useEffect } from "react";

import LibraryServicesCMS from "./LibraryServicesCMS";
import LibraryServicesPreview from "./LibraryServicesPreview";
import DragDropReorder from "./DragDropReorder";
import HeroCarouselCMS from "./HeroCarouselCMS";
import UHeroUpdated from "./UHeroUpdated";
import FeaturedBookCMS from "./FeaturedBookCMS";

const CMSMainContainer = () => {
    const [toggleCarousel, setToggleCarousel] = useState(false)
    const [toggleLibServ, setLibServ] = useState(false)
    const [toggleFeatured, setToggleFeatured] = useState(true)

    return (
        <>
            <div className="flex justify-between w-full gap-2">
                <button
                    className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                    onClick={() => { setToggleCarousel(false), setLibServ(false), setToggleFeatured(true) }}
                >
                    Featured Works
                </button>
                <button
                    className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                    onClick={() => { setToggleCarousel(true), setLibServ(false), setToggleFeatured(false) }}
                >
                    Carousel
                </button>
                <button
                    className="add-book w-full mb-2 px-4 py-2 rounded-lg border-grey hover:bg-light-gray transition"
                    onClick={() => { setToggleCarousel(false), setLibServ(true), setToggleFeatured(false) }}
                >
                    Library Services
                </button>
            </div>
            <div id="cms-cont">
                {toggleLibServ ? (
                    <>
                        <LibraryServicesCMS />
                        <div className="flex gap-4">
                            <div className="w-2/3">
                                <LibraryServicesPreview />
                            </div>
                            <div className="w-1/3 h-full sticky top-4">
                                <DragDropReorder />
                            </div>
                        </div>

                    </>
                ) :
                    toggleCarousel ? (
                        <>
                            <HeroCarouselCMS />
                            <UHeroUpdated />
                        </>
                    )
                        :
                        toggleFeatured ? (
                            <>
                                <FeaturedBookCMS />
                            </>
                        )
                            : (<></>)
                }
            </div>
        </>
    )

}

export default CMSMainContainer