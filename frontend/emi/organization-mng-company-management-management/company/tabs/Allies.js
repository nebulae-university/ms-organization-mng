import React, { useState, useEffect } from 'react';
import { TextField, Typography, Chip } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useLazyQuery } from "@apollo/react-hooks";
import { useEventCallback } from 'rxjs-hooks';
import { debounceTime } from "rxjs/operators";
import { OrganizationMngAlliesListing } from '../../gql/Company';

export function Allies(props) {
  const { dataSource: form, setCompany, T, setpartnersToDelete, partnersToDelete, setForm, form: formSinceCompany } = props;
  const gqlOrganizationMngAlliesListing = OrganizationMngAlliesListing({});
  const [queryAlliesListing, queryAlliesListingResult] = useLazyQuery(gqlOrganizationMngAlliesListing.query, { fetchPolicy: gqlOrganizationMngAlliesListing.fetchPolicy });
  const [alliesList, setAlliesList] = useState([]);
  const [selectedAlliesObj, setSelectedAlliesObj] = useState(formSinceCompany.partnersDetails || []);
  const [deletedIds, setDeletedIds] = useState([])

  const [alliesPacKeywordCallBack, alliesPacKeyword] = useEventCallback((event$) => event$.pipe(debounceTime(500)));

  const userAsString = (user) => {
    return user ? `${user.name}` : "???";
  };

  const updateCompany = (selectedAllies) => {
    const selectedIds = selectedAllies.map(x => x.id);
    setForm({...formSinceCompany, partners: selectedIds} )
    // setCompany(prevCompany => ({
    //   ...prevCompany,
    //   partners: selectedIds,
    //   partnersDetails: selectedAllies
    // }));
  };

  const handleAlliesChange = (evt, selectedAlliesResources) => {
    evt.preventDefault();
    evt.stopPropagation();    
    const selectedManagerObjs = selectedAlliesResources.map(x => {

      return x.id ? x : alliesList.find(o => o.id === x);
    });

    // console.log("selectedManagerObjs ==>", selectedManagerObjs);
    setSelectedAlliesObj(selectedManagerObjs);
    updateCompany(selectedManagerObjs);
  };

  const handleAlliesListInputChange = (evt, value) => {
    if (value && value !== '') {
      alliesPacKeywordCallBack(value);
    }
  };

  useEffect(() => {
    if (alliesPacKeyword) {
      queryAlliesListing({ variables: { alliesSearch: alliesPacKeyword, organizationId: formSinceCompany.organizationId, companyId: formSinceCompany.id } });
    }
  }, [alliesPacKeyword, formSinceCompany.organizationId]);

  useEffect(() => {
    if (queryAlliesListingResult.data) {
      const dataAlliesListing = queryAlliesListingResult.data.OrganizationMngAlliesListing.listing;
      setAlliesList(dataAlliesListing);
    }
  }, [queryAlliesListingResult]);

  useEffect(() => {
    setSelectedAlliesObj(formSinceCompany.partnersDetails || []);
  }, [formSinceCompany.partnersDetails]);

  const filteredAlliesList = alliesList.filter(ally => !selectedAlliesObj.find(selected => selected.id === ally.id));

  useEffect(() => {
    if (deletedIds.length > 0) {
      // console.log("deleted ids ==>", deletedIds);
      const nonExistentIds = deletedIds.filter(deletedId =>
        !selectedAlliesObj.some(ally => ally.id === deletedId)
      );

      setpartnersToDelete(new Set(nonExistentIds));

    }
  }, [deletedIds, selectedAlliesObj]);

  return (
    <form onSubmit={e => e.preventDefault()}>
      <Typography className="mt-8 text-16 sm:text-20 truncate" color="inherit">
        {T.translate("company.allies.subTitle")}
      </Typography>
      <Autocomplete
        id="alliesIds"
        multiple
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const user = alliesList.find((u) => u.id === option.id) || option;
            return (
              <Chip
                key={index}
                label={userAsString(user)}
                {...getTagProps({ index })}
                onDelete={() => {

                  const deletedId = user.id

                  setDeletedIds(prevDeletedIds => [...prevDeletedIds, deletedId]);

                  const newSelectedAlliesObj = selectedAlliesObj.filter(obj => obj.id !== option.id);
                  setSelectedAlliesObj(newSelectedAlliesObj);
                  updateCompany(newSelectedAlliesObj);
                }}
              />
            );
          })
        }
        getOptionLabel={(option) => userAsString(option)}
        options={filteredAlliesList}
        value={selectedAlliesObj}
        onChange={handleAlliesChange}
        onInputChange={handleAlliesListInputChange}
        renderInput={(params) => {
          params.inputProps.autoComplete = "off";
          return (
            <TextField
              {...params}
              variant="outlined"
              margin="normal"
              fullWidth
              placeholder={T.translate("company.allies.placeHolder")}
            />
          );
        }}
      />
    </form>
  );
}
