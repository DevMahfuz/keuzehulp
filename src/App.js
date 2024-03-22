import "./App.css";

import Breadcrumb from "./component/breadcrumbs/breadcrumbs";
import Header from "./component/header/header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./component/home/home";
import NavigationButtons from "./component/NavigationButtons/NavigationButtons";
import Beamer from "./component/Beamer/beamer";
import Woonkamer from "./component/Beamer/woonkamer/woonkamer";
import Slaapkamer from "./component/Beamer/slaapkamer/slaapkamer";
import Kantor from "./component/Beamer/kantoor/kantor";
import Zakelijke from "./component/Beamer/zakelijke/zakelijke";
import Lichte from "./component/Beamer/woonkamer/lichte/lichte";
import Donkere from "./component/Beamer/woonkamer/donkere/donkere";
import DonkereDichtbij from "./component/Beamer/woonkamer/donkere/dichtbij/dichtbij";
import DonkereUst from "./component/Beamer/woonkamer/donkere/ust/ust";
import DonkereVerderweg from "./component/Beamer/woonkamer/donkere/verderweg/verderweg";
import LichteDichtbij from "./component/Beamer/woonkamer/lichte/dichtbij/dichtbij";
import LichteUst from "./component/Beamer/woonkamer/lichte/ust/ust";
import LichteVerderweg from "./component/Beamer/woonkamer/lichte/verderweg/verderweg";
import SlaapkamerUst from "./component/Beamer/slaapkamer/ust/ust";
import SlaapkamerDichtbij from "./component/Beamer/slaapkamer/dichtbij/dichtbij";
import SlaapkamerVerderweg from "./component/Beamer/slaapkamer/verderweg/verderweg";
import KantorLicht from "./component/Beamer/kantoor/Licht/Licht";
import KantorDonker from "./component/Beamer/kantoor/donker/donker";
import KantoorLichtKlein from "./component/Beamer/kantoor/Licht/Klein";
import KantoorLichtMiddelgroot from "./component/Beamer/kantoor/Licht/Middelgroot";
import KantoorLichtGroot from "./component/Beamer/kantoor/Licht/Groot";
import KantoorDonkerKlein from "./component/Beamer/kantoor/donker/Klein";
import KantoorDonkerGroot from "./component/Beamer/kantoor/donker/Groot";
import KantoorDonkerMiddelgroot from "./component/Beamer/kantoor/donker/Middelgroot";
import ZakelijkeLichte from "./component/Beamer/zakelijke/Lichte/Lichte";
import ZakelijkeLichteKlein from "./component/Beamer/zakelijke/Lichte/Klein";
import ZakelijkeLichteMiddelgroot from "./component/Beamer/zakelijke/Lichte/Middelgroot";
import ZakelijkeLichteGroot from "./component/Beamer/zakelijke/Lichte/Groot";
import ZakelijkeDonkere from "./component/Beamer/zakelijke/donkere/donkere";
import ZakelijkeDonkereKlein from "./component/Beamer/zakelijke/donkere/Klein";
import ZakelijkeDonkereMiddelgroot from "./component/Beamer/zakelijke/donkere/Middelgroot";
import ZakelijkeDonkereGroot from "./component/Beamer/zakelijke/donkere/Groot";
import Projectiescherm from "./component/Projectiescherm/Projectiescherm";
import ProjectieschermVanafDeVloerOmhoog from "./component/Projectiescherm/VanafDeVloerOmhoog/VanafDeVloerOmhoog";
import ProjectieschermVanafHetPlafondNaarBeneden from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/VanafHetPlafondNaarBeneden";
import ProjectieschermMobielOmMeeTeNemen from "./component/Projectiescherm/MobielOmMeeTeNemen/MobielOmMeeTeNemen";
import ProjectieschermVastAanDeWand from "./component/Projectiescherm/VastAanDeWand/VastAanDeWand";
import ProjectieschermVanafDeVloerOmhoogElektrisch from "./component/Projectiescherm/VanafDeVloerOmhoog/Elektrisch/Elektrisch";
import ProjectieschermVanafDeVloerOmhoogHandmatig from "./component/Projectiescherm/VanafDeVloerOmhoog/Handmatig/Handmatig";
import ProjectieschermVanafDeVloerOmhoogElektrischTot2Meter from "./component/Projectiescherm/VanafDeVloerOmhoog/Elektrisch/Tot2Meter";
import ProjectieschermVanafDeVloerOmhoogElektrischTot3Meter from "./component/Projectiescherm/VanafDeVloerOmhoog/Elektrisch/Tot3Meter";
import ProjectieschermVanafDeVloerOmhoogElektrischTot4Meter from "./component/Projectiescherm/VanafDeVloerOmhoog/Elektrisch/Tot4Meter";
import ProjectieschermVanafDeVloerOmhoogHandmatigTot2Meter from "./component/Projectiescherm/VanafDeVloerOmhoog/Handmatig/Tot2Meter";
import ProjectieschermVanafDeVloerOmhoogHandmatigTot3Meter from "./component/Projectiescherm/VanafDeVloerOmhoog/Handmatig/Tot3Meter";
import ProjectieschermVanafDeVloerOmhoogHandmatigTot4Meter from "./component/Projectiescherm/VanafDeVloerOmhoog/Handmatig/Tot4Meter";
import ProjectVanHetElektrisch from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/Elektrisch/Elektrisch";
import PVanafHetE4k from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/Elektrisch/een4KBeamer/een4KBeamer";
import PVanafHetETot2Meter from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/Elektrisch/een4KBeamer/Tot2Meter";
import PVanafHetETot3Meter from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/Elektrisch/een4KBeamer/Tot3Meter";
import PVanafHetETot4Meter from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/Elektrisch/een4KBeamer/Tot4Meter";
import PVanafHetEEenHDbeamerr from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/Elektrisch/eenHDbeamer/eenHDbeamer";
import PVanafHetEEenHDbeamerrTot2Meter from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/Elektrisch/eenHDbeamer/Tot2Meter";
import PVanafHetEEenHDbeamerrTot3Meter from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/Elektrisch/eenHDbeamer/Tot3Meter";
import PVanafHetEEenHDbeamerrTot4Meter from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/Elektrisch/eenHDbeamer/Tot4Meter";
import PVanDeVloerOmhoogEEenhelelichteruimte from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/Elektrisch/eenhelelichteruimte/eenhelelichteruimte";
import PVanHetPlaHandmatig from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/Handmatig/Handmatig";
import PVanHetPlaHandmatigTot2Meter from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/Handmatig/Tot2Meter";
import PVanHetPlaHandmatigTot3Meter from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/Handmatig/Tot3Meter";
import PVanHetPlaHandmatigTot4Meter from "./component/Projectiescherm/VanafHetPlafondNaarBeneden/Handmatig/Tot4Meter";
import PMobielTot2Meter from "./component/Projectiescherm/MobielOmMeeTeNemen/Tot2Meter";
import PMobielTot3Meter from "./component/Projectiescherm/MobielOmMeeTeNemen/Tot3Meter";
import PMobielTot4Meter from "./component/Projectiescherm/MobielOmMeeTeNemen/Tot4Meter";
import PVastAanDeWandUST from "./component/Projectiescherm/VastAanDeWand/UST/UST";
import PVastAanDeWandUSTTot2Meter from "./component/Projectiescherm/VastAanDeWand/UST/Tot2Meter";
import PVastAanDeWandUSTTot3Meter from "./component/Projectiescherm/VastAanDeWand/UST/Tot3Meter";
import PVastAanDeWandUSTTot4Meter from "./component/Projectiescherm/VastAanDeWand/UST/Tot4Meter";
import PVastAanDeWandNormale from "./component/Projectiescherm/VastAanDeWand/Normale/Normale";
import PVastAanDeWandNormaleTot2Meter from "./component/Projectiescherm/VastAanDeWand/Normale/Tot2Meter";
import PVastAanDeWandNormaleTot3Meter from "./component/Projectiescherm/VastAanDeWand/Normale/Tot3Meter";
import PVastAanDeWandNormaleTot4Meter from "./component/Projectiescherm/VastAanDeWand/Normale/Tot4Meter";
import Beugel from "./component/Beugel/Beugel";
import BeugelPlafond from "./component/Beugel/Plafond/Plafond";
import BeugelPlafondZwart from "./component/Beugel/Plafond/Zwart/Zwart";
import BeugelMuur from "./component/Beugel/Muur/Muur";
import BeugelMuurZwart from "./component/Beugel/Muur/Zwart/Zwart";
import BeugelMuurWit from "./component/Beugel/Muur/Wit/Wit";
import BeugelEen from "./component/Beugel/Een/Een";
import Accessoires from "./component/Accessoires/Accessoires";
import AccessoiresMediaspeler from "./component/Accessoires/Mediaspeler";
import AccessoiresHDMIKabel from "./component/Accessoires/HDMI-Kabel";
import Accessoires3DBril from "./component/Accessoires/3DBril";
import BeugelPlafondWit from "./component/Beugel/Plafond/Wit/Wit";

function App() {
  return (
    <Router>
      <Header />
      <Breadcrumb />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="beamer">
          <Route index element={<Beamer />} />
          <Route path="Voor-in-de-woonkamer">
            <Route index element={<Woonkamer />} />
            <Route path="ik-heb-een-donkere-woonkamer">
              <Route index element={<Donkere />} />
              <Route path="ust" element={<DonkereUst />} />
              <Route path="dichtbij" element={<DonkereDichtbij />} />

              <Route path="verderweg" element={<DonkereVerderweg />} />
            </Route>
            <Route path="ik-heb-een-lichte-woonkamer">
              <Route index element={<Lichte />} />
              <Route path="ust" element={<LichteUst />} />
              <Route path="dichtbij" element={<LichteDichtbij />} />

              <Route path="verderweg" element={<LichteVerderweg />} />
            </Route>
          </Route>
          <Route path="Voor-in-de-slaapkamer">
            <Route index element={<Slaapkamer />} />
            <Route path="ust" element={<SlaapkamerUst />} />
            <Route path="dichtbij" element={<SlaapkamerDichtbij />} />
            <Route path="verderweg" element={<SlaapkamerVerderweg />} />
          </Route>

          <Route path="Voor-op-kantoor">
            <Route index element={<Kantor />} />
            <Route path="licht">
              <Route index element={<KantorLicht />} />
              <Route path="Klein" element={<KantoorLichtKlein />} />
              <Route path="Middelgroot" element={<KantoorLichtMiddelgroot />} />
              <Route path="Groot" element={<KantoorLichtGroot />} />
            </Route>
            <Route path="donker">
              <Route index element={<KantorDonker />} />
              <Route path="Klein" element={<KantoorDonkerKlein />} />
              <Route
                path="Middelgroot"
                element={<KantoorDonkerMiddelgroot />}
              />
              <Route path="Groot" element={<KantoorDonkerGroot />} />
            </Route>
          </Route>
          <Route path="Voor-mijn-zakelijke-project">
            <Route index element={<Zakelijke />} />
            <Route path="Lichte-Omgeving">
              <Route index element={<ZakelijkeLichte />} />
              <Route path="Klein" element={<ZakelijkeLichteKlein />} />
              <Route
                path="Middelgroot"
                element={<ZakelijkeLichteMiddelgroot />}
              />
              <Route path="Groot" element={<ZakelijkeLichteGroot />} />
            </Route>
            <Route path="redelijk-donkere-omgeving">
              <Route index element={<ZakelijkeDonkere />} />
              <Route path="Klein" element={<ZakelijkeDonkereKlein />} />
              <Route
                path="Middelgroot"
                element={<ZakelijkeDonkereMiddelgroot />}
              />
              <Route path="Groot" element={<ZakelijkeDonkereGroot />} />
            </Route>
          </Route>
        </Route>
        <Route path="projectiescherm">
          <Route index element={<Projectiescherm />} />
          <Route path="Vanaf-de-vloer-omhoog">
            <Route index element={<ProjectieschermVanafDeVloerOmhoog />} />
            <Route path="Elektrisch-bedienen">
              <Route
                index
                element={<ProjectieschermVanafDeVloerOmhoogElektrisch />}
              />
              <Route
                path="tot-2-meter-breed"
                element={
                  <ProjectieschermVanafDeVloerOmhoogElektrischTot2Meter />
                }
              />
              <Route
                path="tot-3-meter-breed"
                element={
                  <ProjectieschermVanafDeVloerOmhoogElektrischTot3Meter />
                }
              />
              <Route
                path="tot-4-meter-breed"
                element={
                  <ProjectieschermVanafDeVloerOmhoogElektrischTot4Meter />
                }
              />
            </Route>
            <Route path="Handmatig-bedienen">
              <Route
                index
                element={<ProjectieschermVanafDeVloerOmhoogHandmatig />}
              />
              <Route
                path="tot-2-meter-breed"
                element={
                  <ProjectieschermVanafDeVloerOmhoogHandmatigTot2Meter />
                }
              />
              <Route
                path="tot-3-meter-breed"
                element={
                  <ProjectieschermVanafDeVloerOmhoogHandmatigTot3Meter />
                }
              />
              <Route
                path="tot-4-meter-breed"
                element={
                  <ProjectieschermVanafDeVloerOmhoogHandmatigTot4Meter />
                }
              />
            </Route>
          </Route>
          <Route path="Vanaf-het-plafond-naar-beneden">
            <Route
              index
              element={<ProjectieschermVanafHetPlafondNaarBeneden />}
            />
            <Route path="Elektrisch-bedienen">
              <Route index element={<ProjectVanHetElektrisch />} />
              <Route path="een-4K-Beamer">
                <Route index element={<PVanafHetE4k />} />
                <Route
                  path="tot-2-meter-breed"
                  element={<PVanafHetETot2Meter />}
                />
                <Route
                  path="tot-3-meter-breed"
                  element={<PVanafHetETot3Meter />}
                />
                <Route
                  path="tot-4-meter-breed"
                  element={<PVanafHetETot4Meter />}
                />
              </Route>
              <Route path="een-HD-beamer">
                <Route index element={<PVanafHetEEenHDbeamerr />} />
                <Route
                  path="tot-2-meter-breed"
                  element={<PVanafHetEEenHDbeamerrTot2Meter />}
                />
                <Route
                  path="tot-3-meter-breed"
                  element={<PVanafHetEEenHDbeamerrTot3Meter />}
                />
                <Route
                  path="tot-4-meter-breed"
                  element={<PVanafHetEEenHDbeamerrTot4Meter />}
                />
              </Route>
              <Route
                path="een-hele-lichte-ruimte"
                element={<PVanDeVloerOmhoogEEenhelelichteruimte />}
              />
            </Route>
            <Route path="Handmatig-bedienen">
              <Route index element={<PVanHetPlaHandmatig />} />
              <Route
                path="tot-2-meter-breed"
                element={<PVanHetPlaHandmatigTot2Meter />}
              />
              <Route
                path="tot-3-meter-breed"
                element={<PVanHetPlaHandmatigTot3Meter />}
              />
              <Route
                path="tot-4-meter-breed"
                element={<PVanHetPlaHandmatigTot4Meter />}
              />
            </Route>
          </Route>
          <Route path="Mobiel-om-mee-te-nemen">
            <Route index element={<ProjectieschermMobielOmMeeTeNemen />} />
            <Route path="1-tot-2-meter-breed" element={<PMobielTot2Meter />} />
            <Route path="2-tot-3-meter-breed" element={<PMobielTot3Meter />} />
            <Route path="3-tot-4-meter-breed" element={<PMobielTot4Meter />} />
          </Route>
          <Route path="Vast-aan-de-wand">
            <Route index element={<ProjectieschermVastAanDeWand />} />
            <Route path="UST-Beamer">
              <Route index element={<PVastAanDeWandUST />} />
              <Route
                path="1-tot-2-meter-breed"
                element={<PVastAanDeWandUSTTot2Meter />}
              />
              <Route
                path="2-tot-3-meter-breed"
                element={<PVastAanDeWandUSTTot3Meter />}
              />
              <Route
                path="3-tot-4-meter-breed"
                element={<PVastAanDeWandUSTTot4Meter />}
              />
            </Route>
            <Route path="Normale-Beamer">
              <Route index element={<PVastAanDeWandNormale />} />
              <Route
                path="1-tot-2-meter-breed"
                element={<PVastAanDeWandNormaleTot2Meter />}
              />
              <Route
                path="2-tot-3-meter-breed"
                element={<PVastAanDeWandNormaleTot3Meter />}
              />
              <Route
                path="3-tot-4-meter-breed"
                element={<PVastAanDeWandNormaleTot4Meter />}
              />
            </Route>
          </Route>
        </Route>
        <Route path="beugel">
          <Route index element={<Beugel />} />
          <Route path="Plafond-montage">
            <Route index element={<BeugelPlafond />} />
            <Route path="Zwart" element={<BeugelPlafondZwart />} />
            <Route path="Wit" element={<BeugelPlafondWit />} />
          </Route>

          <Route path="Muur-Montage">
            <Route index element={<BeugelMuur />} />
            <Route path="Zwart" element={<BeugelMuurZwart />} />
            <Route path="Wit" element={<BeugelMuurWit />} />
          </Route>
          <Route path="Een-projector-standaard">
            <Route index element={<BeugelEen />} />
          </Route>
        </Route>
        <Route path="accessoires">
          <Route index element={<Accessoires />} />
          <Route path="Mediaspeler" element={<AccessoiresMediaspeler />} />
          <Route path="HDMI-Kabel" element={<AccessoiresHDMIKabel />} />
          <Route path="3D-Bril" element={<Accessoires3DBril />} />
        </Route>
      </Routes>
      <NavigationButtons />
    </Router>
  );
}

export default App;
