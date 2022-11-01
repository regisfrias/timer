<script lang="ts">
  import '../global.css'
  import { onMount } from 'svelte';
  import { msToTime, msToTimeObj, pad } from '../lib/utils'
  const colors = [
    '#e0053c',
    '#f25b36',
    '#e88d23',
    '#aca138',
    '#3e9853',
    '#178d84',
    '#3e9853',
    '#aca138',
    '#e88d23',
    '#f25b36',
  ]

  interface timerType {
    start: string
    diff: number
    name: string
    interval: number
  }

  interface timersType {
    [date: string]: {
      timers: timerType[] | []
      total: number
      date: Date
    }
  }

  let today: Date = new Date()
  let todaysKey = today.toISOString().substring(0, 10)
  let allTimers: timersType = {[todaysKey]: {
    timers: [],
    total: 0,
    date: today
  }}
  let interval = 0

  const save = () => localStorage.setItem('timers', JSON.stringify(allTimers))

  onMount(() => {
    if (localStorage.timers) {
      const timers = JSON.parse(localStorage.timers)
      if (Object.keys(timers).length) {
        allTimers = timers
      }
    }
  })

	const updateDate = (timerDate: string, timerId: number) => {
    const current = new Date()
    const timer = allTimers[timerDate].timers[timerId]
    const start = new Date(timer.start)
		const diff = (current.getTime() - start.getTime())
    const total = (allTimers[timerDate].timers as timerType[]).reduce((prev, timer) => prev + timer.diff, 0)
    allTimers[timerDate].timers[timerId] = {...timer, diff}
    allTimers[timerDate].total = total
    save()
	}

  const startTimer = (evt: Event) => {
    const target = evt.target as HTMLInputElement
    const timerId = target.dataset.timerId ? parseInt(target.dataset.timerId) : 0
    const todaysKey = target.dataset.timerDay || ''
    const start = new Date()

    if (interval) {
      window.clearInterval(interval);
    }
    interval = window.setInterval(() => updateDate(todaysKey, timerId), 1000)

    const newTimer = {
      start: start.toISOString(),
      diff: 0,
      name: '',
      interval,
    }

    if (allTimers[todaysKey] && allTimers[todaysKey].timers.length === timerId) {
      allTimers[todaysKey] = {
        ...allTimers[todaysKey],
        timers: [
          ...allTimers[todaysKey].timers,
          newTimer
        ]
      }
    } else {
      if (allTimers[todaysKey]) {
        const diff = allTimers[todaysKey].timers[timerId].diff
        const name = allTimers[todaysKey].timers[timerId].name
        const newStart = new Date(start.getTime() - diff)
        allTimers[todaysKey].timers.splice(timerId, 1, {
          start: newStart.toISOString(),
          diff,
          name,
          interval,
        })
      } else {
        allTimers[todaysKey] = {timers: [newTimer], total: 0, date: today}
      }
    }

    updateDate(todaysKey, timerId)
  }

  // const onNameChange = () => localStorage.setItem(`timers`, `${JSON.stringify(allTimers)}`)

  const removeAll = () => {
    localStorage.clear()
    allTimers = {}
  }

  const stopTimer = () => {
    window.clearInterval(interval)
    interval = 0
  }

  const onChangeTime = (evt: Event, timerId: number, thisDay: string) => {
    const target = evt.target as HTMLInputElement
    const value = parseInt(target.value)
    const thisDate = new Date(allTimers[thisDay].timers[timerId].diff)
    switch (target.name) {
      case 'hrs':
        thisDate.setHours(value)
        break;
      case 'mins':
        thisDate.setMinutes(value)
        break;
      case 'secs':
        thisDate.setSeconds(value)
        break;
      default:
        break;
    }
    allTimers[thisDay].timers[timerId].diff = thisDate.getTime()
    save()
  }
</script>

<main class="wrapper">
  <h1>Simple Timer</h1>

  {#if allTimers && Object.keys(allTimers).length}
    <article class="allTimers">
      {#each Object.keys(allTimers).reverse() as thisDay}
        {@const date = new Date(allTimers[thisDay].date)}
        <h2 class="timers-title"><span>{#if todaysKey === thisDay}Today{:else}{date.toLocaleString('en-FI', { weekday: 'long',})}{/if}</span><span>{`${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`}</span></h2>
        {#each allTimers[thisDay].timers as timer, timerId}
          <div style={`border-right: 2px solid ${colors[timerId % colors.length]}`} class="timer {interval === timer.interval ? 'current' : ''}">
            {#if interval === timer.interval}
              <button class="play_pause active" data-timer-id={timerId} on:click={stopTimer}>■</button>
            {:else}
              <button style={`background-color: ${colors[timerId % colors.length]}`} class="play_pause" data-timer-id={timerId} data-timer-day={thisDay} on:click={startTimer}>►</button>
            {/if}
            <input class="timer-name" data-timer-id={timerId} data-timer-day={thisDay} type="text" name="" id="" bind:value={timer.name} on:keyup={save} placeholder="Timer name" />
            <div class="time">
              <input
                on:change={evt => onChangeTime(evt, timerId, thisDay)}
                type="number"
                name="hrs"
                id=""
                max="24"
                min="0"
                value={pad(msToTimeObj(timer.diff).hrs)}
              >:
              <input
                on:change={evt => onChangeTime(evt, timerId, thisDay)}
                type="number"
                name="mins"
                id=""
                max="60"
                min="0"
                value={pad(msToTimeObj(timer.diff).mins)}
              >:
              <input
                on:change={evt => onChangeTime(evt, timerId, thisDay)}
                type="number"
                name="secs"
                id=""
                max="60"
                min="0"
                value={pad(msToTimeObj(timer.diff).secs)}
              >
            </div>
          </div>
        {/each}
        <div class="total">
          <div>Total</div>
          <div>{msToTime(allTimers[thisDay].total)}</div>
        </div>
      {/each}
    </article>
  {/if}
</main>

<footer class="footer">
  <div class="wrapper">
    <button on:click={startTimer} data-timer-id={allTimers[todaysKey] && allTimers[todaysKey].timers ? Object.keys(allTimers[todaysKey].timers).length : 0} data-timer-day={todaysKey}>Start new timer</button>
    <button on:click={removeAll}>Delete all</button>
  </div>
</footer>

<style>
  h1 {
    text-align: center;
  }

  .allTimers {
    max-width: 100%;
  }

  .timers-title {
    display: flex;
    justify-content: space-between;
  }

  .timer {
    display: grid;
    grid-template-columns: 3rem 1fr 1fr;
    grid-column-gap: var(--padding_sm);
    border-bottom: 1px solid #00000024;
  }

  .timer.current {
    background-color: #00000024;
  }

  .timer input {
    display: block;
    min-height: 1.6rem;
    min-width: calc(120px - 1rem);
    line-height: 1;
    margin: 0;
    padding: 0.5rem;
    border: 1px solid transparent;
    background-color: transparent;
    color: white;
    transition: background-color var(--fast);
  }

  .timer input:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .timer input:focus {
    outline: 0;
    background-color: rgba(255, 255, 255, 0.05);
  }

  .time {
    display: flex;
    align-items: center;
  }

  .time input {
    max-width: 3rem;
    width: 1rem;
    min-width: 0;
    padding: 0;
    border: 0;
  }

  .time input:not(:first-child) {
    margin-left: 1px;
  }

  /* Chrome, Safari, Edge, Opera */
  .time input::-webkit-outer-spin-button,
  .time input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  .time input[type=number] {
    -moz-appearance: textfield;
  }

  .play_pause {
    font-size: 1rem;
    width: 3rem;
  }

  .total {
    display: grid;
    grid-template-columns: 3rem 1fr 1fr;
    grid-column-gap: var(--padding_sm);
    border-bottom: 1px solid #00000024;
  }

  .total div {
    padding: var(--padding_sm) 0;
  }

  .total div:first-child {
    padding-left: 0.5rem;
    min-width: calc(120px - 0.5rem);
    grid-column-start: 2;
    grid-column-end: 3;
  }

  .footer {
    position: fixed;
    bottom: 0;
    box-shadow: 1px -1px 24px 0px rgba(0,0,0,0.2);
    padding: var(--padding_sm) var(--padding);
    width: calc(100% - var(--padding) * 2);
    -webkit-box-shadow: 1px -1px 24px 0px rgba(0,0,0,0.2);
    -moz-box-shadow: 1px -1px 24px 0px rgba(0,0,0,0.2);
  }
  .footer .wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: var(--padding);
    align-items: stretch;
    background-color: var(--background);
  }

</style>
