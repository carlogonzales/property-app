import {FaShare} from "react-icons/fa";
import {
    FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon,
    TwitterIcon, WhatsappIcon, EmailShareButton, EmailIcon
} from 'react-share';

const ShareButtons = ({property}) => {
    const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`;

    return (
        <>
            <h3 className='text-xl font-bold text-center pt-2'>Share this property: </h3>
            <div className="flex items-center justify-center gap-4 mt-2">
                <FacebookShareButton url={shareUrl} quote={property.name} hashtag={`#${property.type.replace(/\s/g, '')}ForRent`}>
                    <FacebookIcon size={40} round />
                </FacebookShareButton>
                <TwitterShareButton url={shareUrl} title={property.name} hashtag={[`#${property.type.replace(/\s/g, '')}ForRent`]}>
                    <TwitterIcon size={40} round />
                </TwitterShareButton>
                <WhatsappShareButton url={shareUrl} title={property.name} seperator="::">
                    <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                <EmailShareButton url={shareUrl} subject={property.name} body="Check out this property listing.">
                    <EmailIcon size={40} round />
                </EmailShareButton>
            </div>
        </>
    );
};

export default ShareButtons;