<script>
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { useVisibilityObserver } from '$lib/customHooks/useVisibilityObserver.svelte';
    import { base } from '$app/paths';
    import PersonIconContainer from './PersonIconContainer.svelte';
    import MoneyIconContainer from './MoneyIconContainer.svelte';
    import IncomeButtonContainer from './IncomeButtonContainer.svelte';
    import IncomeArticle from './IncomeArticle.svelte';

    let observer = $state();
    let elementToObserve;

    //static chart details
    const onePerson = `${base}/images/income-chart/one.png`;
    const twoPersons = `${base}/images/income-chart/two.png`;
    const threePersons = `${base}/images/income-chart/three.png`;
    const fourPersons = `${base}/images/income-chart/four.png`;

    const householdSizes = ["onePerson", "twoPersons", "threePersons", "fourPersons"];
    const iconsArray = [[onePerson, "Eine Person"], [twoPersons, "Zwei Personen"], [threePersons, "Drei Personen"], [fourPersons, "ab 4 Personen"]];
    const totalIcons = 100;
    const data = {
        "onePerson": {
            "rentPercentage": [44, 28, 23, 20, 16],
            "incomeLevels": ["unter 1.500€", "1.500–2000€", "2.000€ - 3.000€", "3.000€ - 4.000€", "Über 4.000€"]
        },
        "twoPersons": {
            "rentPercentage": [44, 30, 23, 19, 16],
            "incomeLevels": ["unter 1.500€", "1.500–2000€", "2.000€ - 3.000€", "3.000€ - 4.000€", "Über 4.000€"]
        },
        "threePersons": {
            "rentPercentage": [49, 34, 26, 20, 16],
            "incomeLevels": ["unter 1.500€", "1.500–2000€", "2.000€ - 3.000€", "3.000€ - 4.000€", "Über 4.000€"]
        },
        "fourPersons": {
            "rentPercentage": [58, 37, 28, 22, 17],
            "incomeLevels": ["unter 1.500€", "1.500–2000€", "2.000€ - 3.000€", "3.000€ - 4.000€", "Über 4.000€"]
        }
    };


    //dynamic chart details
    let selectedHousehold = $state(0);
    let selectedIncome = $state(2);
    let household = $derived(householdSizes[selectedHousehold]);
    let displayIncome = $derived(data[householdSizes[selectedHousehold]].incomeLevels[selectedIncome]);
    let percentage = $derived(data[household].rentPercentage[selectedIncome]);
    let coloredIcons = $derived(Math.round(totalIcons * (percentage / 100)));
    let displayPercentage = $derived(percentage.toFixed(0).replace('.', ','));


    const handleIconClick = (index) => {
        selectedHousehold = index;
    }

    const handleIncomeClick = (index) => {
        selectedIncome = index;
    }

    onMount(() => {
        observer = useVisibilityObserver(elementToObserve);
    });

</script>

<section class="einkommen" bind:this={elementToObserve}>
    <h2 class="title-einkommen">Wieviel vom Einkommen geht für die Miete drauf?</h2>
    <figure class="income-chart-container">
        {#if observer && observer.isVisible}
            <div class="controls-container separator" in:fly={{ y: 200, duration: 2000 }}>
                <PersonIconContainer
                    {householdSizes} 
                    {iconsArray} 
                    {handleIconClick} 
                    selectedIndex={selectedHousehold}/>
                <IncomeButtonContainer 
                    {handleIncomeClick} 
                    incomeLevels={data[householdSizes[selectedHousehold]].incomeLevels}
                    selectedIndex={selectedIncome}
                />
            </div>
        {/if}
        {#if observer && observer.isVisible}
            <div class="money-icon-container" 
                in:fly={{ y: 200, duration: 2000, delay: 1000 }}>
                <MoneyIconContainer 
                    {coloredIcons} 
                    {displayPercentage}
                    {displayIncome} 
                    {percentage}
                />
        </div>
        {/if} 
    </figure>
    {#if observer && observer.isVisible}
            <div in:fly={{ y: 200, duration: 2000, delay: 2000 }}>
                <IncomeArticle />
            </div>
        {/if}  
</section>  

<style>

    .einkommen {
        z-index: 1;
        background-color: var(--dark);
        margin: 0 auto;
        color: var(--bright);
        padding-bottom: 0.5rem;
    }

    .title-einkommen {
        width: 100%;
        text-align: center;
        padding: 2rem;
        margin: auto;
        padding-top: 2rem;
    }

    .income-chart-container {
        width: 100%;
        max-width: 1200px;
        display: grid;
        grid-template-columns: repeat(3, 1fr); 
        gap: 0.8rem;
        margin: 4rem auto;

        & div {
            flex-basis: 33%;
            min-width: 350px; 
            margin: 0.3rem;
            padding: 0.5rem;
        }
    }

    .separator {
        border-right: 1px solid var(--bright);
        margin: 0.4rem;
    }

    .controls-container {
        padding: auto 2rem;
        margin-right: 0.2rem;
    }

    .money-icon-container {
        grid-column-start: 2;
        grid-column-end:   4;
    }

    @media (max-width: 1200px) {
        .income-chart-container {
            grid-template-columns: repeat(2, 1fr); /* 2 Spalten für Mobile */
            grid-template-rows: auto auto; /* Zwei Reihen */

            & div {
                grid-column: 1 / -1; 
            }
        }

        .einkommen {
            margin: 0 auto;
        }

        .separator {
            border-right: 0;
        }

        .controls-container {
            display: flex;
        }

    }


</style>        