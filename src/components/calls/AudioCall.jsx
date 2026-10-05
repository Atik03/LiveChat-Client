"use client";

import { Phone, Users } from "lucide-react";

export default function AudioCall() {
  /* ==================================================
     TEMPORARY CONTACT DATA
     -----------------------------------------------
     Later this array will be replaced with API data.
  ================================================== */

  const contacts = [
    {
      _id: "1",
      name: "Rahim Ahmed",
      username: "rahim_ahmed",
      image: "",
      isOnline: true,
    },
    {
      _id: "2",
      name: "Karim Hasan",
      username: "karim_hasan",
      image: "",
      isOnline: false,
    },
    {
      _id: "3",
      name: "Sakib Khan",
      username: "sakib_khan",
      image: "",
      isOnline: true,
    },
    {
      _id: "4",
      name: "Nusrat Jahan",
      username: "nusrat_jahan",
      image: "",
      isOnline: true,
    },
    {
      _id: "5",
      name: "Tanvir Rahman",
      username: "tanvir_rahman",
      image: "",
      isOnline: false,
    },
  ];

  /* ==================================================
     START AUDIO CALL
     -----------------------------------------------
     Functionality will be connected later.
  ================================================== */

  const handleAudioCall = (contact) => {
    console.log("Start audio call with:", contact);
  };

  return (
    <section className="flex h-full min-h-0 flex-col bg-base-200">
      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="shrink-0 border-b border-base-300 bg-base-100 px-4 py-5 sm:px-6">
        <div>
          <h1 className="text-lg font-bold sm:text-xl">Audio Calls</h1>

          <p className="mt-1 text-sm text-base-content/50">
            Choose a contact to start an audio call.
          </p>
        </div>
      </header>

      {/* ==================================================
          CONTACT LIST
      ================================================== */}

      <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-3">
        <div className=" w-full ">
          {contacts.length === 0 ? (
            /* ==================================================
               EMPTY STATE
            ================================================== */

            <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users size={30} />
              </div>

              <h2 className="mt-5 text-base font-semibold">No contacts yet</h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-base-content/50">
                Add contacts to your LiveChat account to start audio calls with
                them.
              </p>
            </div>
          ) : (
            /* ==================================================
               CONTACT CARD
            ================================================== */

            <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
              {contacts.map((contact) => {
                const initials = contact.name
                  ?.split(" ")
                  .filter(Boolean)
                  .map((word) => word.charAt(0))
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={contact._id}
                    className="
                      flex
                      items-center
                      gap-3
                      border-b
                      border-base-300
                      px-4
                      py-3
                      transition-colors
                      last:border-b-0
                      hover:bg-base-200/60
                      sm:px-5
                      sm:py-3.5
                    "
                  >
                    {/* ==================================================
                        PROFILE IMAGE
                    ================================================== */}

                    <div className="relative shrink-0">
                      <div
                        className="
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-full
                          bg-gradient-to-br
                          from-primary
                          to-secondary
                          text-sm
                          font-bold
                          text-primary-content
                          sm:h-13
                          sm:w-13
                        "
                      >
                        {contact.image ? (
                          <img
                            src={contact.image}
                            alt={contact.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>

                      {/* ONLINE INDICATOR */}

                      {contact.isOnline && (
                        <span
                          className="
                            absolute
                            bottom-0
                            right-0
                            h-3.5
                            w-3.5
                            rounded-full
                            border-2
                            border-base-100
                            bg-success
                          "
                        />
                      )}
                    </div>

                    {/* ==================================================
                        USER INFORMATION
                    ================================================== */}

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm font-semibold">
                        {contact.name}
                      </h2>

                      <p className="mt-0.5 truncate text-xs text-base-content/50">
                        {contact.username ? `@${contact.username}` : "Contact"}
                      </p>

                      {/* STATUS */}

                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            contact.isOnline
                              ? "bg-success"
                              : "bg-base-content/30"
                          }`}
                        />

                        <span className="text-[11px] text-base-content/50">
                          {contact.isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>

                    {/* ==================================================
                        AUDIO CALL BUTTON
                    ================================================== */}

                    <button
                      type="button"
                      onClick={() => handleAudioCall(contact)}
                      className="
                        btn
                        btn-ghost
                        btn-square
                        btn-sm
                        shrink-0
                        rounded-xl
                        text-primary
                        transition-all
                        hover:bg-primary/10
                        hover:text-primary
                      "
                      aria-label={`Call ${contact.name}`}
                    >
                      <Phone size={19} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
