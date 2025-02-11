import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
//components
import { VerticalNav } from "@cmsgov/design-system";
//types
import { AppRoles } from "../../types";

const TableOfContents = () => {
  const [userRole, formYear, formData] = useSelector(
    (state) => [
      state.stateUser.currentUser.role,
      state.global.formYear,
      state.formData,
    ],
    shallowEqual
  );

  const location = useLocation();
  const navigate = useNavigate();

  const sections = () => {
    if (formData) {
      const sections = formData;
      return sections.map(
        ({
          contents: {
            section: {
              id: sectionId,
              ordinal,
              subsections,
              title: sectionTitle,
            },
          },
        }) => ({
          id: sectionId,
          ordinal,
          title: sectionTitle,
          subsections: subsections.map(
            ({ id: subsectionId, title: subsectionTitle }) => ({
              id: subsectionId,
              title: subsectionTitle,
            })
          ),
        })
      );
    }
    return [];
  };

  const idToUrl = (location, id) => {
    const endOfPath = id.replace(/-/g, "/");
    if (location.pathname.startsWith("/views/sections")) {
      const pathChunks = location.pathname.split("/");
      const base = pathChunks.slice(0, 4).join("/");
      return `${base}/${endOfPath}`;
    }
    return `/sections/${endOfPath}`;
  };
  const subsection = (index) => String.fromCharCode("A".charCodeAt(0) + index);

  const click = (e, _, url) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(url);
  };

  const items = sections()
    .map(({ id: sectionId, ordinal, subsections, title: sectionTitle }) => ({
      id: sectionId,
      items:
        subsections.length < 2
          ? null
          : subsections.map(
              ({ id: subsectionId, title: subsectionTitle }, i) => ({
                label: `Section ${ordinal}${subsection(i)}: ${subsectionTitle}`,
                onClick: click,
                selected: location.pathname
                  .toLowerCase()
                  .startsWith(idToUrl(location, subsectionId).toLowerCase()),
                url: idToUrl(location, subsectionId),
              })
            ),
      label: ordinal > 0 ? `Section ${ordinal}: ${sectionTitle}` : sectionTitle,
      onClick: click,
      selected: location.pathname
        .toLowerCase()
        .startsWith(idToUrl(location, sectionId).toLowerCase()),
    }))
    .map(({ id, items: childItems, ...rest }) => {
      const updated = { id, items: childItems, ...rest };
      if (childItems == null) {
        updated.url = idToUrl(location, id);
      }
      return updated;
    });

  // If the user can certify and submit AND the form is not yet submitted...
  if (userRole === AppRoles.STATE_USER) {
    items.push({
      id: "certify-and-submit",
      label: "Certify and Submit",
      onClick: click,
      selected:
        location.pathname === `/sections/${formYear}/certify-and-submit`,
      url: `/sections/${formYear}/certify-and-submit`,
    });
  }

  const foundSelectedId = items.find((item) => item.selected)?.id;
  return (
    <div className="toc" data-testid="toc" aria-label="Table of Contents">
      <VerticalNav
        selectedId={foundSelectedId}
        ariaNavLabel="Vertical Navigation Element"
        items={items}
      />
    </div>
  );
};

export default TableOfContents;
