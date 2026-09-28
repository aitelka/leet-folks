import type { Metadata } from "next";
import PolicyDocument, {
  Callout,
  DataTable,
  type DocSection,
} from "@/components/PolicyDocument";

export const metadata: Metadata = {
  title: "MaklaFit privacy policy",
  description:
    "Privacy policy for the MaklaFit food and fitness diary. No account: your diary stays on your device, and MaklaFit AI sees only what you choose to send it.",
  alternates: { canonical: "/privacy/maklafit" },
};

const sections: DocSection[] = [
  {
    id: "on-device",
    title: "Your diary, which stays on your device",
    body: (
      <>
        <p>
          To be useful the App needs to know things about you: a name you choose
          for your profile, your age, gender, height, current and target weight,
          activity level, goal and chosen diet, and then what you log each day —
          meals and portions, water, weight readings, and workouts with their
          sets, reps, weights and durations.
        </p>
        <p>
          All of this is written to a private database on your device and is{" "}
          <strong>never transmitted to us</strong>. We operate no server that
          receives it and hold no copy of it. Specifically:
        </p>
        <ul>
          <li>
            Your profile, food log, water log, weight history, workouts, weekly
            workout plan, the foods and recipes you build, your badges, and your
            MaklaFit AI conversations are held in a database inside the App’s own
            storage area, which other apps cannot read.
          </li>
          <li>
            A profile photo you choose, and any photo you send to MaklaFit AI,
            are kept as files in that same private storage.
          </li>
          <li>
            All of it is{" "}
            <strong>excluded from Android cloud backup</strong>, so your health
            history is never uploaded to Google Drive.
          </li>
          <li>
            The diary and your settings <em>are</em> included in a direct
            device-to-device transfer — the user-initiated move between two
            phones you are holding yourself — because that is the case where
            losing your history would actually hurt. It goes straight from the
            old phone to the new one. Photos are not carried across.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "maklafit-ai",
    title: "MaklaFit AI",
    body: (
      <>
        <p>
          MaklaFit AI is the App’s meal assistant: you send it a photo of a meal,
          or describe what you ate, and it replies with an estimate of the
          calories and nutrients that you can add to your diary. It is the one
          feature in which something you create is sent away to be read, so here
          is exactly what happens.
        </p>
        <p>
          <strong>Nothing is sent until you press send.</strong> When you do,
          the App sends:
        </p>
        <ul>
          <li>the photo you attached, if any, reduced in size first;</li>
          <li>the words you typed;</li>
          <li>
            the recent messages of that same conversation — yours and the
            assistant’s — so it can follow what you are correcting or asking
            about;
          </li>
          <li>the language the App is set to, so the reply comes back in it.</li>
        </ul>
        <p>
          <strong>It does not send your profile or your diary.</strong> Your
          name, age, weight, targets, diet and everything you have logged stay on
          your device; the assistant sees only what is in the conversation.
        </p>
        <p>
          The request goes to Google’s Gemini models through Firebase AI Logic,
          running on Google Cloud’s Vertex AI, and carries a Firebase App Check
          token that shows it came from a genuine copy of the App. It carries no
          name, account or advertising identifier. Google processes it to
          produce the reply under{" "}
          <a
            href="https://cloud.google.com/vertex-ai/generative-ai/docs/data-governance"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Cloud’s data governance terms for Vertex AI
          </a>
          , under which Google does not use it to train its models. We do not
          receive or store your photos or messages ourselves.
        </p>
        <p>
          The conversation and its photos are then kept on your device, in the
          assistant’s history, until you delete that chat. Deleting a chat does
          not remove anything you added to your diary from it. Nothing reaches
          your diary unless you choose to add it.
        </p>
        <p>
          The number of free photos and messages each day, and the extra ones a
          short video earns, are counted on your device.
        </p>
        <Callout label="Think before you send" tone="warn">
          <p>
            A photo can show more than a plate — a face, a room, a document.
            Please send only photos of food, and do not type personal or medical
            details into a message. The estimates are produced by an AI model,
            can be wrong, and are not medical or dietary advice.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: "health-connect",
    title: "Health Connect",
    body: (
      <>
        <p>
          On Android, the App can connect to Health Connect, the store on your
          phone where health apps and devices such as Samsung Health, Google Fit
          and smartwatches keep their data. This is off until you turn it on and
          grant the permissions in Health Connect’s own screen, and you can
          revoke any of them there at any time.
        </p>
        <p>With your permission the App reads:</p>
        <ul>
          <li>steps;</li>
          <li>active calories burned and total calories burned;</li>
          <li>heart rate;</li>
          <li>sleep;</li>
          <li>weight.</li>
        </ul>
        <p>
          It uses these only to show them to you — on the Home screen and the
          App’s Health Connect screen — and to count the calories you burned
          toward your day.
        </p>
        <p>With your permission the App writes:</p>
        <ul>
          <li>the meals you log, with their calories and nutrients;</li>
          <li>the water you log;</li>
          <li>your weight readings;</li>
          <li>your workouts, as exercise sessions.</li>
        </ul>
        <p>
          Health Connect data is exchanged on your device only.{" "}
          <strong>
            What the App reads from Health Connect is never sent to us, to
            MaklaFit AI, to analytics or to advertisers,
          </strong>{" "}
          and is never sold. Use of information received from Health Connect
          adheres to the{" "}
          <a
            href="https://support.google.com/googleplay/android-developer/answer/12991134"
            rel="noopener noreferrer"
            target="_blank"
          >
            Health Connect Permissions policy
          </a>
          , including the Limited Use requirements.
        </p>
      </>
    ),
  },
  {
    id: "shared-foods",
    title: "Foods you create, which are shared publicly",
    body: (
      <>
        <p>
          The App’s value depends on a food being findable by barcode. When you
          create a food — typically after scanning a barcode the App does not
          yet recognise — that nutrition record is uploaded to a shared database
          (Google Cloud Firestore) so the next person who scans the same barcode
          finds it already filled in.
        </p>
        <p>What is uploaded is the food record and nothing else:</p>
        <ul>
          <li>The name you gave it, including its Arabic name, and its category;</li>
          <li>Serving size and unit;</li>
          <li>
            Nutrition per 100g: calories, protein, carbohydrate, fat, fibre,
            sugar, saturated fat, trans fat, cholesterol, sodium, potassium,
            vitamin A, vitamin C, calcium and iron;
          </li>
          <li>
            The barcode, a product image URL where one exists, and the time the
            record was created.
          </li>
        </ul>
        <p>
          <strong>No identifier of any kind travels with it.</strong> The record
          does not carry your name, an account, a device identifier, or anything
          linking it back to you, because the App has no such identifier to
          attach. Nothing from your diary is uploaded: not the fact that you ate
          the food, not when, not how much.
        </p>
        <Callout label="These records are public" tone="warn">
          <p>
            Any copy of the App can read the shared food database — that is the
            point of it. Please do not type personal information into a food
            name or an Arabic name, because unlike your diary, that field is not
            private.
          </p>
          <p>
            The App cannot delete a shared record once written. If you need one
            corrected or removed, write to the address at the bottom of this
            page with the barcode and we will handle it.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: "camera",
    title: "The camera and your photos",
    body: (
      <>
        <p>
          The App asks for camera permission only at the moment you open
          something that needs it, and works without it — you can search and
          enter foods by hand, and choose photos from your gallery instead. The
          camera is used for three things:
        </p>
        <ul>
          <li>
            <strong>Reading a barcode</strong> on a package, or a QR code on a
            piece of gym equipment. This happens entirely on your device, using
            Google’s ML Kit running locally; camera frames are examined in memory
            to find the code and are then discarded. No photograph is saved or
            uploaded. Gym equipment QR codes from Life Fitness machines are
            decoded on your device as well: the App reads the workout summary out
            of the code itself and does not contact <code>halo.fitness</code> or
            any other equipment service.
          </li>
          <li>
            <strong>Taking a meal photo for MaklaFit AI</strong>, which is sent
            as described above when you press send.
          </li>
          <li>
            <strong>Taking a profile photo.</strong> You frame and rotate it in
            the App, and the result is stored on your device only.{" "}
            <strong>It is never uploaded</strong> — not to us, not to MaklaFit
            AI, not to anyone.
          </li>
        </ul>
        <p>
          Photos from your gallery are chosen through Android’s own photo
          picker, which hands the App only the photo you pick. The App asks for
          no permission to read your photo library and cannot see anything else
          in it.
        </p>
      </>
    ),
  },
  {
    id: "backup-file",
    title: "Backup files you save",
    body: (
      <>
        <p>
          From Settings you can save your whole diary to a file and restore it
          later, on the same phone or another. The file holds everything the App
          keeps — your profile, food, water, weight and workout history, your
          own foods and recipes, and your MaklaFit AI conversations.
        </p>
        <p>
          You choose where the file goes, using Android’s own file picker: your
          phone, a memory card, or a cloud drive you use. It goes nowhere else,
          and we never receive a copy. The file is{" "}
          <strong>not encrypted</strong>, so anyone who can open it can read it;
          keep it somewhere you trust, and delete copies you no longer need.
        </p>
      </>
    ),
  },
  {
    id: "automatic",
    title: "Information collected automatically",
    body: (
      <>
        <p>
          The App includes services from Google that send data in the
          background. We see these only as aggregated reports; they are not
          linked to your name or to any account, because there is none.
        </p>
        <DataTable
          caption="Third-party services in MaklaFit, what each collects, and why"
          rows={[
            {
              service: "Google Analytics for Firebase",
              collects:
                "App opens and in-app events, session length, device model, operating system version, language, country derived from IP address, and a randomly generated app instance identifier",
              why: "To understand which features are used and where the App is failing people",
            },
            {
              service: "Firebase Crashlytics",
              collects:
                "Crash and error reports, including the stack trace, device model, operating system version, and App state at the moment of the crash",
              why: "To diagnose and fix crashes",
            },
            {
              service: "Firebase Remote Config",
              collects:
                "Retrieves configuration settings — which adverts are shown where, the list of catalogues to download, MaklaFit AI’s settings and daily allowance, and in-app messages. Sends device and App version details as part of the request",
              why: "To adjust settings without shipping an update",
            },
            {
              service: "Firebase In-App Messaging",
              collects:
                "A Firebase installation identifier, and whether a message was shown or tapped",
              why: "To show occasional messages about the App inside it",
            },
            {
              service: "Firebase Cloud Messaging",
              collects: "A push notification token identifying your installation",
              why: "To deliver notifications, where you have allowed them",
            },
            {
              service: "Firebase App Check (Play Integrity)",
              collects:
                "A check with Google Play that the request comes from a genuine, unmodified copy of the App on a genuine device",
              why: "To stop other software from using the App’s access to MaklaFit AI and its databases",
            },
            {
              service: "Google Play In-App Review",
              collects:
                "Nothing from the App. Google Play shows its own rating sheet, and does not tell us whether you rated or what",
              why: "To let you rate the App without leaving it",
            },
            {
              service: "Google AdMob",
              collects:
                "Advertising ID, IP address, ad impressions and interactions, and general device information",
              why: "To display advertising, which funds the App",
            },
          ]}
        />
        <p>
          <strong>What analytics never sees is your diary.</strong> These
          services report how the App is used — that it was opened, that a
          session lasted so long, that a build crashed — and they are not given
          the contents of anything you log. No meal, weight reading, water entry,
          workout, Health Connect figure or MaklaFit AI conversation is sent to
          them, and none of it is used to target advertising.
        </p>
        <p>
          Google processes the data above as described in the{" "}
          <a
            href="https://policies.google.com/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Privacy Policy
          </a>
          . Further detail is available for{" "}
          <a
            href="https://firebase.google.com/support/privacy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Firebase
          </a>{" "}
          and for{" "}
          <a
            href="https://support.google.com/admob/answer/6128543"
            rel="noopener noreferrer"
            target="_blank"
          >
            AdMob
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "notifications",
    title: "Notifications",
    body: (
      <>
        <p>
          The App can send notifications — the meal, water and workout reminders
          you choose in its settings, and occasional news about the App itself.
          On Android 13 and later you are asked for permission, and you can
          refuse, or change your mind later under{" "}
          <em>Android Settings → Apps → MaklaFit → Notifications</em>. Nothing
          else in the App depends on it: the diary, the scanner and the
          catalogues all work exactly the same if you say no.
        </p>
        <p>
          Reminders are scheduled on your device. Before one is shown, the App
          checks your diary on the device, so you are not reminded of something
          you have already logged; that check never leaves your phone.
        </p>
        <p>
          To deliver news about the App, Google’s Firebase Cloud Messaging
          issues your installation a token. It identifies the installation, not
          you: it carries no name, no account and nothing from your diary, and it
          changes if you reinstall the App or clear its data. We do not upload
          that token anywhere or keep a list of them, because there is no server
          of ours to keep it on — these notifications are sent to broad
          audiences rather than to individuals.
        </p>
      </>
    ),
  },
  {
    id: "services",
    title: "Services your device contacts",
    body: (
      <>
        <p>
          Besides Google, the App reaches a few other destinations. In each case
          your device connects directly, nothing from your diary is sent, and we
          see nothing of the exchange.
        </p>
        <ul>
          <li>
            <strong>Our catalogue files.</strong> On first launch, and when an
            update is published, the App downloads its dish, ingredient,
            exercise and packaged-product catalogues, and loads exercise photos
            as you view them. These come from our file server at{" "}
            <code>cdn.leetfolks.com</code>, run on Cloudflare, or from Google
            Firebase Storage when that is unavailable. Like any web server, they
            see your IP address and which file was asked for; Cloudflare handles
            that under{" "}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              rel="noopener noreferrer"
              target="_blank"
            >
              its own privacy policy
            </a>
            . Nothing else about you is sent, and we do not use these downloads
            to identify anyone.
          </li>
          <li>
            <strong>Open Food Facts.</strong> When you scan a barcode that is in
            neither the App’s own catalogue nor the shared food database, the App
            looks the product up at <code>world.openfoodfacts.org</code> and may
            load a product photo from their image servers. That service sees your
            IP address and the barcode you asked about. Their handling of it is
            governed by{" "}
            <a
              href="https://world.openfoodfacts.org/privacy"
              rel="noopener noreferrer"
              target="_blank"
            >
              their own privacy policy
            </a>
            , not by this one.
          </li>
          <li>
            <strong>Our social pages.</strong> Links to MaklaFit’s pages on
            Facebook, Instagram, WhatsApp and TikTok open those services, whose
            own policies apply from that point.
          </li>
        </ul>
        <p>
          All of the App’s network traffic uses HTTPS. It does not permit
          unencrypted connections.
        </p>
      </>
    ),
  },
  {
    id: "advertising",
    title: "Advertising and your choices",
    body: (
      <>
        <p>
          The App shows advertising supplied by Google AdMob, including short
          videos you can choose to watch to earn extra MaklaFit AI photos or
          messages. Where required — including in the European Economic Area,
          the United Kingdom, and Switzerland — the App presents a consent form
          from Google’s User Messaging Platform before any personalised
          advertising is served, and records your answer. You may change that
          answer at any time, and withdraw consent you previously gave, under{" "}
          <em>Settings → Ad Privacy Options</em> in the App, which appears where
          the rules of your region provide for it.
        </p>
        <p>
          Independently of the App, Android lets you limit ad tracking or delete
          your advertising identifier under <em>Settings → Privacy → Ads</em>.
          Doing so does not remove advertising, but it stops it being
          personalised.
        </p>
        <p>
          <strong>Your health data is never used to target advertising.</strong>{" "}
          Nothing you log — your weight, your meals, your workouts, your Health
          Connect figures, your conversations with MaklaFit AI — is shared with
          AdMob or any advertiser.
        </p>
      </>
    ),
  },
  {
    id: "health",
    title: "Health information",
    body: (
      <>
        <p>
          What you record in MaklaFit — body measurements, what you have eaten,
          what you have lifted, and what you read in from Health Connect — is
          health information, and it is treated as the most sensitive thing the
          App holds. It is kept on your device, excluded from cloud backup, never
          sold, never shared with advertisers, and never used for any purpose
          other than showing you your own figures inside the App. The only part
          of it that ever leaves your device is what you yourself put into a
          message or photo for MaklaFit AI.
        </p>
        <p>
          The App is not a medical device. Its calorie and nutrition figures
          come from public catalogues, from records other people have entered,
          and from an AI model, so they are estimates and may be wrong. Nothing
          in the App is medical advice, and it should not be used to diagnose or
          treat any condition. Talk to a qualified professional before making
          significant changes to your diet or training — including starting a
          diet such as keto or intermittent fasting — especially if you are
          pregnant, managing a medical condition, or recovering from an eating
          disorder.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Retention and deletion",
    body: (
      <>
        <p>
          Everything held on your device stays there until you remove it. You
          can delete individual entries and MaklaFit AI chats from within the
          App, clear all of it at once through{" "}
          <em>Android Settings → Apps → MaklaFit → Storage → Clear data</em>, or
          remove it entirely by uninstalling the App. Because we hold no copy,
          uninstalling is genuinely the end of it — except for backup files you
          saved yourself, which stay wherever you put them.
        </p>
        <p>
          What the App wrote to Health Connect stays there until you delete it
          in Health Connect, as with any app’s data.
        </p>
        <p>
          Food records already published to the shared database are the other
          exception: they stay after you uninstall, since other people’s scans
          now depend on them. They contain nothing that identifies you. Write to
          us if you want one corrected or taken down.
        </p>
        <p>
          Data held by Google — MaklaFit AI requests, crash reports, analytics
          and advertising data — is retained according to Google’s own terms and
          schedules. To have data associated with your installation deleted from
          those systems, contact us at the address below and include the date
          and approximate time of use, since we hold no identifier that would let
          us find you otherwise.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        The App is not directed at children under 13, and we do not knowingly
        collect personal information from them. Calorie targets, diets and
        weight tracking are not designed for children, whose nutritional needs
        differ and who should be guided by a paediatrician rather than by an
        app. If you believe a child has provided us with personal information,
        contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <>
        <p>
          Your diary is stored in private application storage that other apps
          cannot access, and is excluded from cloud backup so it is not copied
          off the device. All network connections the App makes are encrypted
          with HTTPS, and requests to MaklaFit AI carry a Firebase App Check
          token showing they come from a genuine copy of the App.
        </p>
        <p>
          No account exists to be broken into, and no server of ours holds your
          history, which removes the largest category of risk. The trade-off is
          that a lost or wiped phone means a lost diary unless you saved a backup
          file or transferred it directly to a new device.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>
          Depending on where you live, you may have the right to access,
          correct, delete, or port your personal data, to object to or restrict
          its processing, and to withdraw consent. Residents of the European
          Economic Area and the United Kingdom hold these rights under the GDPR;
          residents of California hold comparable rights under the CCPA,
          including the right not to be discriminated against for exercising
          them. We do not sell personal information.
        </p>
        <p>
          Because the App has no accounts, almost nothing reaches us, and what
          does is not linked to your identity. You can take a full copy of your
          own data at any time by saving a backup file. To exercise any of these
          rights, or to complain to a supervisory authority, use the contact
          address below.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy as the App changes. The effective date at the
        top will be revised, and material changes will be signalled in the App
        or on its Google Play listing. Continuing to use the App after a change
        means you accept the revised policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Questions about this policy or about your data can be sent to{" "}
        <a href="mailto:leetfolks@gmail.com">leetfolks@gmail.com</a>.
      </p>
    ),
  },
];

export default function MaklaFitPrivacy() {
  return (
    <PolicyDocument
      slug="maklafit"
      sections={sections}
      meta={{
        kind: "MaklaFit, on Google Play",
        title: "MaklaFit",
        icon: "/apps/maklafit-icon.png",
        effective: "28 September 2026",
        updated: "28 September 2026",
        facts: [
          { label: "Package", value: "com.leetfolks.maklafit" },
          { label: "Platforms", value: "Android · iOS" },
        ],
        intro: (
          <p>
            This policy explains what the MaklaFit application (package{" "}
            <code>com.leetfolks.maklafit</code>, the “App”) does with
            information when you use it. The App is published by Leet Folks
            (“we”, “us”).
          </p>
        ),
        summary: (
          <>
            <p>
              MaklaFit is a food and fitness diary. There is no account and no
              sign-up.
            </p>
            <p>
              What you eat, drink, weigh and lift is stored only on your device.
              We operate no server that receives your diary, and it is excluded
              from Android cloud backup. If you connect Health Connect, what the
              App reads from it stays on your device too.
            </p>
            <p>
              Three things do leave your device. A photo or message you send to{" "}
              <strong>MaklaFit AI</strong> goes to Google’s Gemini models to be
              answered — only when you press send, and without your profile or
              diary. A food <em>you</em> create is published to a shared food
              database so the next person who scans that barcode finds it — with
              no identifier saying it came from you. And anonymous usage
              statistics, crash reports and advertising data go to Google.
            </p>
            <p>
              None of what you log — no meal, weight, or workout — is ever part
              of that.
            </p>
          </>
        ),
        note: (
          <p>
            MaklaFit is published by Leet Folks. This policy covers the MaklaFit
            mobile application only, and does not cover any third-party service
            you reach through it.
          </p>
        ),
      }}
    />
  );
}
